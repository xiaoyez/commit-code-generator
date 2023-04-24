import {TopSearchDefinition} from "../../definition/index/TopSearchDefinition";
import {
    SearchType, TopDictSelectSearchItemDefinition,
    TopInputSearchItemDefinition,
    TopSearchItemDefinition, TopSelectSearchItemDefinition
} from "../../definition/index/TopSearchItemDefinition";

export class TopSearchGenerator {

    public static generateVueTemplate(definition: TopSearchDefinition) {
        let text = '';
        text += `<el-form :model="${definition.model}" ref="queryForm" :inline="true" v-show="true">`
        definition.items.forEach(item => {
            text += TopSearchGenerator.generateVueTemplateItem(definition,item);
        })
        text += '      <el-form-item>\n' +
        '        <el-button type="primary" icon="Search" size="mini" @click="handleQuery">搜索</el-button>\n' +
        '        <el-button icon="Refresh" size="mini" @click="resetQuery">重置</el-button>\n' +
        '      </el-form-item>'
        text += `</el-form>`;
        return "";
    }

    public static generateVueTemplateItem(definition: TopSearchDefinition,item: TopSearchItemDefinition) {
        let text = '';
        switch (item.type) {
            case SearchType.INPUT:
                text += TopSearchGenerator.generateVueTemplateInputItem(definition,item);
                break;
            case SearchType.SELECT:
                text += TopSearchGenerator.generateVueTemplateSelectItem(definition,item);
                break;
            case SearchType.DATE:
                text += TopSearchGenerator.generateVueTemplateDateItem(definition,item);
                break;
        }
        return "";
    }

    public static generateVueTemplateInputItem(definition: TopSearchDefinition,item: TopSearchItemDefinition) {
        const inputItem = item as TopInputSearchItemDefinition;
        let text = '';
        text += `<el-form-item label="${inputItem.label}" prop="${item.prop}">`;
        text += `  <el-input v-model="${definition.model}.${item.prop}" placeholder="${inputItem.placeholder}" size="${inputItem.size}"></el-input>`;
        text += `</el-form-item>`;
        return text;
    }

    public static generateVueTemplateSelectItem(definition: TopSearchDefinition, item: TopSearchItemDefinition) {
        const selectItem = item as TopSelectSearchItemDefinition;
         let text = '';
        text += `<el-form-item label="${selectItem.label}" prop="${item.prop}">`;
        text += `  <el-select v-model="${definition.model}.${item.prop}" placeholder="${selectItem.placeholder}" size="${selectItem.size}">`;
        text +=
`    <el-option v-for="${selectItem.iterVarName} in ${selectItem.iterArrayName}" 
        :key="${selectItem.iterVarName}.${selectItem.keyProp}" 
        :label="${selectItem.iterVarName}.${selectItem.labelProp}" 
        :value="${selectItem.iterVarName}.${selectItem.valueProp}" />`;
        text += `  </el-select>`;
        text += `</el-form-item>`;

        return text;
    }

    public static generateVueScript(definition: TopSearchDefinition) {
        let text = '';
        text += `<script lang="ts">`;
        text += `const { proxy } = getCurrentInstance();`;
        text += `const ${definition.model} = ref()`;

        text += `</script>`;
        return "";
    }

    public static generateVueTemplateDateItem(definition: TopSearchDefinition, item: TopSearchItemDefinition) {
        return "";
    }
}