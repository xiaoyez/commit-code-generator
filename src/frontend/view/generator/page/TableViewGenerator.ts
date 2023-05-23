import {
    ActBtn, ColActBtn,
    TableColDefinition,
    TableColType,
    TableDefinition,
    TableViewDefinition
} from "../../definition/page/TableViewDefinition";
import {ApiUtils} from "../../../../api/utils/ApiUtils";
import {config} from "../../../../config/Config";
import {ApiDefinition} from "../../../../api/definition/ApiDefinition";

export class TableViewGenerator {

    static actBtnTemplate: Record<ActBtn, (api:ApiDefinition)=>string> = {
        [ActBtn.ADD]: api => `      <el-button type="primary" plain icon="Plus" size="small"
                 @click="handleAdd" v-has-permi="['${config.projectName}:${api.module?.baseUrlPrefix}:add']">新增
      </el-button>`,
        [ActBtn.EDIT]: api => `      <el-button type="primary" plain icon="Plus" size="small"
                 @click="handleAdd" v-has-permi="['${config.projectName}:${api.module?.baseUrlPrefix}:edit']">修改
      </el-button>`,
        [ActBtn.REMOVE]: api => `      <el-button type="primary" plain icon="Plus" size="small"
                 @click="handleAdd" v-has-permi="['${config.projectName}:${api.module?.baseUrlPrefix}:remove']">删除
      </el-button>`,
        [ActBtn.EXPORT]: api => `      <el-button type="primary" plain icon="Plus" size="small"
                 @click="handleAdd" v-has-permi="['${config.projectName}:${api.module?.baseUrlPrefix}:export']">导出
      </el-button>`
    }

    static colTemplate: Partial<Record<TableColType, (col: TableColDefinition, dataTypeName: string) => string>> = {
        [TableColType.DICT]: ( col, dataTypeName) => {
            return `      <template #default="{ row }: { row: ${dataTypeName} }">
        <dict-tag :options="getDict('${col.dictName}').value" :value="row.${col.prop}"/>
      </template>\n`;
        },
        [TableColType.IMG]: ( col, dataTypeName) => {
            return `      <template #default="{ row }: { row: ${dataTypeName} }">
          <el-image
            v-if="getImg(row.${col.prop})"
            style="height: 100px"
            :src="fileUrl(getImg(row.${col.prop}))"
          />
        </template>\n`;
        }
    }

    static colOperateTemplate: Record<ColActBtn, (col: TableColDefinition, dataTypeName: string, api: ApiDefinition) => string> = {
        [ColActBtn.EDIT]: (col, dataTypeName,api) =>
            `        <el-button size="small" link icon="Edit" @click="handleUpdate(row)"
                   v-has-permi="['${config.projectName}:${api.module?.baseUrlPrefix}:edit']">修改
        </el-button>`,
        [ColActBtn.REMOVE]: (col, dataTypeName,api) =>
            `      <el-button size="small" link icon="Delete" @click="handleRemove(row)"
                   v-has-permi="['${config.projectName}:${api.module?.baseUrlPrefix}:remove']">删除
        </el-button>`,
        [ColActBtn.INFO]: (col, dataTypeName,api) =>
            `      <el-button size="small" link icon="Info" @click="showInfo(row)"
                   v-has-permi="['${config.projectName}:${api.module?.baseUrlPrefix}:info']">详情
        </el-button>`,

    }

    static generate(tableViewDefinition : TableViewDefinition) {
        let text = '';
        text += TableViewGenerator.generateTemplate(tableViewDefinition);
        text += TableViewGenerator.generateScript(tableViewDefinition);
    }

    private static generateTemplate(tableViewDefinition: TableViewDefinition) {
        let text = '';
        text += '<template>\n';
        // actBtns
        text += TableViewGenerator.generateActBtnsTemplate(tableViewDefinition);
        // el-table
        text += TableViewGenerator.generateTableTemplate(tableViewDefinition);

        text += '</template>\n';

        return text;
    }

    private static generateActBtnsTemplate(tableViewDefinition: TableViewDefinition) {
        let text = '';
        if (tableViewDefinition.actBtnArr && tableViewDefinition.actBtnArr.length > 0) {
            text += '  <el-row :gutter="10" class="mb8">\n';
            text += tableViewDefinition.actBtnArr.map(btn => {
                return `<el-col :span="1.5">
${TableViewGenerator.actBtnTemplate[btn]}      
    </el-col>`
            })
            text += '  </el-row>\n';
        }
        text += '    <right-toolbar v-model:showSearch="displaySearch" @queryTable="getList"></right-toolbar>\n';
        return text;
    }

    private static generateTableTemplate(tableViewDefinition: TableViewDefinition) {
        let text = '';
        const {tableDef} = tableViewDefinition;
        text += `  <el-table :data="${tableDef.dataName}" border stripe size="mini" v-loading="loading" @selection-change="handleSelectionChange">\n`;
        text += `    <el-table-column type="selection" width="55" align="center"/>\n`;
        text += `    <el-table-column label="序号">
      <template #default="{ $index }: { $index: number }">
        {{ calcOrder($index) }}
      </template>
    </el-table-column>\n`;
        const dataTypeName = ApiUtils.getResultDataTypeName(tableDef.api);
        text += tableDef.cols.map(col => {
            return TableViewGenerator.generateTableColTemplate(tableDef,col, dataTypeName,tableDef.api);
        }).join('\n');

        if (tableDef.isPage)
        {
            text += `  <pagination v-show="totalRows > 0" :total="totalRows" v-model:page.sync="paging.pageNum"
              v-model:limit.sync="paging.pageSize" @pagination="getList"/>`;
        }

        text += `  </el-table>\n`

        return text;
    }

    private static generateTableColTemplate(tableDef: TableDefinition, col: TableColDefinition, dataTypeName: string,api: ApiDefinition) {
        let text = '';
        text += `    <el-table-column label="${col.label}" prop="${col.prop}" width="${col.width}" align="${col.align}"\n`;
        if (col.type === TableColType.TEXT) {
            text += '/>\n';
        } else {
            text += '>\n';
            text += TableViewGenerator.colTemplate[col.type]?.(col, dataTypeName);
            text += '    </el-table-column>\n';
        }
        if (tableDef.colActBtnArr.length > 0) {
            text += `    <el-table-column label="操作" width="100" fixed="right" align="center">`
            text += `      <template #default="{ row }: { row: ${dataTypeName} }">\n`;
            text += tableDef.colActBtnArr.map(btn => {
                return TableViewGenerator.colOperateTemplate[btn](col, dataTypeName,api);
            }).join('\n');
            text += `      </template>\n`;
            text += `    </el-table-column>\n`;
        }
        return text;
    }

    private static generateScript(tableViewDefinition: TableViewDefinition) {
        let text = '';

        return "";
    }
}