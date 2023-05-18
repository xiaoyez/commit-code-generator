import {
    DateInputControl,
    DictSelectInputControl,
    FilterDefinition,
    FilterFormDefinition,
    FilterFormItemDefinition, InputControl, SelectInputControl, TextInputControl
} from "../../definition/page/FilterDefinition";

type InputControlTempGen = (modelName: string, def: InputControl) => string;

export class FilterGenerator {
    private static filterItemGenMap = new Map<InputControl, InputControlTempGen>([
        [TextInputControl, FilterGenerator.generateTextInputControlTemplate as InputControlTempGen],
        [SelectInputControl, FilterGenerator.generateSelectInputControlTemplate as InputControlTempGen],
        [DictSelectInputControl, FilterGenerator.generateSelectInputControlTemplate as InputControlTempGen],
        [DateInputControl, FilterGenerator.generateDateInputControlTemplate as InputControlTempGen],
    ]);

    static generate(filterDefinition: FilterDefinition) {
        let text = '';
        text += FilterGenerator.generateTemplate(filterDefinition.filterFormDefinition);
        return text;
    }

    private static generateTemplate(filterFormDefinition: FilterFormDefinition) {
        let text = '';
        const modelName = filterFormDefinition.modelName || "queryParams";
        const refName = filterFormDefinition.refName || "queryForm";
        const vShowName = filterFormDefinition.vShowName || "showSearch";

        text += '<template>\n';
        text += `  <el-form class="filter-form" :model="${modelName}" ref="${refName}" :inline="true" v-show="${vShowName}">\n`
        text += filterFormDefinition.items.map(def => FilterGenerator.generateFilterItemTemplate(modelName, def)).join('\n');
        text += `
    <el-form-item>
      <el-button type="primary" icon="Search" size="small" @click="handleQuery">搜索</el-button>
      <el-button icon="Refresh" size="small" @click="resetQuery">重置</el-button>
    </el-form-item>`;
        text += `  </el-form>\n`
        text += '</template>\n';
        return text;
    }

    private static generateFilterItemTemplate(modelName: string, itemDef: FilterFormItemDefinition) {
        let text = '';
        text += `    <el-form-item label="${itemDef.label}" prop="${itemDef.prop}">\n`;
        text += FilterGenerator.generateFilterItemControlTemplate(modelName, itemDef.inputControl) + '\n';
        text += '    </el-form-item>'
        return text;
    }

    private static generateFilterItemControlTemplate<T extends InputControl>(modelName: string, defControl: T) {
        let gen = (FilterGenerator.filterItemGenMap.get(defControl.constructor) as (modelName: string, def: T) => string)
            || (() => '<el-input placeholder="Error" />');
        return gen(modelName, defControl);
    }

    private static generateTextInputControlTemplate(modelName: string, defControl: TextInputControl) {
        return `      <el-input v-model="${modelName}.${defControl.vModelName}" placeholder="${defControl.placeholder}"/>`;
    }

    private static generateSelectInputControlTemplate(modelName: string, defControl: SelectInputControl) {
        const keyFiled = defControl.key || defControl.value;
        return `      <el-select v-model="${modelName}.${defControl.vModelName}" placeholder="${defControl.placeholder}" clearable filterable>
        <el-option v-for="${defControl.iterName} in ${defControl.listName}" :key="${defControl.iterName}.${keyFiled}" :label="${defControl.iterName}.${defControl.label}" :value="${defControl.iterName}.${defControl.value}"/>
      </el-select>`;
    }

    private static generateDateInputControlTemplate(modelName: string, defControl: DateInputControl) {
        const compType = 'date' + (defControl.withTime ? "time" : '') + (defControl.isRange ? "range" : '');

        const modelStr = defControl.isRange ? (modelName + '.') : "" + defControl.model;

        const otherProps = defControl.isRange ? `
        range-separator="${defControl.rangeSeparator}"
        start-placeholder="${defControl.startPlaceholder}"
        end-placeholder="${defControl.endPlaceholder}"` : `
        placeholder="${defControl.startPlaceholder}"`;

        return `      <el-date-picker
        v-model="${modelStr}"
        value-format="${defControl.format}"
        type="${compType}"${otherProps}
      />`;
    }
}
