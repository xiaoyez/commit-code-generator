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
import {addNewImport, emptyImportLines, generateImportLines, getTypeImportsFrom} from "../../../../utils/TSImportUtils";
import {tsTypeString} from "../../../../utils/TypeUtils";
import {compileEjsTmp} from "../../../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../../../ejsTmp/EjsTmp";

function isStrTuple2(i: [string, string?]): i is [string, string] {
    return !!i[1];
}


export class TableViewGenerator {

    // private static actBtnTemplate: Record<ActBtn, (api: ApiDefinition) => string> = {
    //     [ActBtn.ADD]: api => `      <el-button type="primary" plain icon="Plus" size="small"
    //              @click="handleAdd()" v-has-permi="['${config.projectName}:${prefix2Module(api.module?.baseUrlPrefix)}:add']">新增
    //   </el-button>`,
    //     [ActBtn.EDIT]: api => `      <el-button type="success" plain icon="Edit" size="small" :disabled="notSingle"
    //              @click="handleUpdate()" v-has-permi="['${config.projectName}:${prefix2Module(api.module?.baseUrlPrefix)}:edit']">修改
    //   </el-button>`,
    //     [ActBtn.REMOVE]: api => `      <el-button type="danger" plain icon="Delete" size="small" :disabled="notMulti"
    //              @click="handleDelete()" v-has-permi="['${config.projectName}:${prefix2Module(api.module?.baseUrlPrefix)}:remove']">删除
    //   </el-button>`,
    //     [ActBtn.EXPORT]: api => `      <el-button type="warning" plain icon="Download" size="small"
    //              @click="handleExport()" v-has-permi="['${config.projectName}:${prefix2Module(api.module?.baseUrlPrefix)}:export']">导出
    //   </el-button>`
    // }

    // private static colTemplate: Partial<Record<TableColType, (col: TableColDefinition, dataTypeName: string) => string>> = {
    //     [TableColType.DICT]: (col, dataTypeName) => {
    //         return `      <template #default="{ row }: { row: ${dataTypeName} }">
    //     <dict-tag :options="getDict('${col.dictName}').value" :value="row.${col.prop}"/>
    //   </template>\n`;
    //     },
    //     [TableColType.IMG]: (col, dataTypeName) => {
    //         return `      <template #default="{ row }: { row: ${dataTypeName} }">
    //       <el-image
    //         v-if="row.${col.prop}"
    //         style="height: 100px"
    //         :src="fileUrl(row.${col.prop})"
    //       />
    //     </template>\n`;
    //     }
    // }

    // private static colOperateTemplate: Record<ColActBtn, (col: TableColDefinition, dataTypeName: string, api: ApiDefinition) => string> = {
    //     [ColActBtn.EDIT]: (col, dataTypeName, api) =>
    //         `        <el-button size="small" link icon="Edit" @click="handleUpdate(row)"
    //                v-has-permi="['${config.projectName}:${api.module?.baseUrlPrefix}:edit']">修改
    //     </el-button>`,
    //     [ColActBtn.REMOVE]: (col, dataTypeName, api) =>
    //         `      <el-button size="small" link icon="Delete" @click="handleDelete(row)"
    //                v-has-permi="['${config.projectName}:${api.module?.baseUrlPrefix}:remove']">删除
    //     </el-button>`,
    //     [ColActBtn.INFO]: (col, dataTypeName, api) =>
    //         `      <el-button size="small" link icon="Info" @click="showInfo(row)"
    //                v-has-permi="['${config.projectName}:${api.module?.baseUrlPrefix}:info']">详情
    //     </el-button>`,
    //
    // }

//     private static actionHandlers: Record<string, (emit: string, dataTypeStr: string) => {
//         emit: string, func: string,
//     }> = {
//         updateList: emit => ({
//             emit: "params: IPagingParams", func: `function getList() {
//     emit('${emit}', paging.value);
// }`,
//         }),
//         onClickAdd: emit => ({
//             emit: "", func: `function handleAdd() {
//     emit('${emit}');
// }`,
//         }),
//         onClickUpdate: (emit, typeDef) => ({
//             emit: `val: ${typeDef}`, func: `function handleUpdate(row?: ${typeDef}) {
//     emit('${emit}', cloneDeep(toRaw(row || selected.value[0])));
// }`
//         }),
//         onClickShowInfo: (emit, typeDef) => ({
//             emit: `val: ${typeDef}`, func: `function showInfo(row?: ${typeDef}) {
//     emit('${emit}', cloneDeep(toRaw(row || selected.value[0])));
// }`
//         }),
//         onClickDelete: (emit, typeDef) => ({
//             emit: `val: ${typeDef}[]`, func: `function handleDelete(row?: ${typeDef}) {
//     let rows = row ? [row] : selected.value;
//     emit('${emit}', cloneDeep(toRaw(rows)));
// }`
//         }),
//         onClickExport: emit => ({
//             emit: "", func: `function handleExport() {
//     emit('${emit}');
// }`,
//         }),
//     }

    // private static actionBtnEmits: Record<ActBtn, string> = {
    //     [ActBtn.ADD]: "onClickAdd",
    //     [ActBtn.EDIT]: "onClickUpdate",
    //     [ActBtn.REMOVE]: "onClickDelete",
    //     [ActBtn.EXPORT]: "onClickExport",
    // }

    // private static colOptBtnEmits: Record<ColActBtn, string> = {
    //     [ColActBtn.EDIT]: "onClickUpdate",
    //     [ColActBtn.REMOVE]: "onClickDelete",
    //     [ColActBtn.INFO]: "onClickShowInfo",
    // }

    static generate(tableViewDefinition: TableViewDefinition) {
        return compileEjsTmp(ejsTmp.tableViewTmp, tableViewDefinition);
        // let text = '';
        // text += TableViewGenerator.generateTemplate(tableViewDefinition);
        // text += TableViewGenerator.generateScript(tableViewDefinition);
        // return text;
    }

    // private static generateTemplate(tableViewDefinition: TableViewDefinition) {
    //     let text = '';
    //     text += '<template>\n';
    //     // actBtns
    //     text += TableViewGenerator.generateActBtnsTemplate(tableViewDefinition);
    //     // el-table
    //     text += TableViewGenerator.generateTableTemplate(tableViewDefinition);
    //
    //     text += '</template>\n';
    //
    //     return text;
    // }

//     private static generateActBtnsTemplate(tableViewDefinition: TableViewDefinition) {
//         let text = '';
//         if (tableViewDefinition.actBtnArr && tableViewDefinition.actBtnArr.length > 0) {
//             text += '  <el-row :gutter="10" class="mb8">\n';
//             text += tableViewDefinition.actBtnArr.map(btn => {
//                 return `    <el-col :span="1.5">
// ${TableViewGenerator.actBtnTemplate[btn](tableViewDefinition.tableDef.api)}
//     </el-col>\n`
//             }).join('')
//             text += '  </el-row>\n';
//         }
//         text += '  <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>\n';
//         return text;
//     }

    // private static generateTableTemplate(tableViewDefinition: TableViewDefinition) {
    //     let text = '';
    //     const {tableDef} = tableViewDefinition;
    //     text += `  <el-table :data="${tableDef.dataName}" border stripe size="mini" v-loading="loading" @selection-change="handleSelectionChange">\n`;
    //     text += `    <el-table-column type="selection" width="55" align="center"/>\n`;
    //     text += `    <el-table-column label="序号">
    //   <template #default="{ $index }: { $index: number }">
    //     {{ calcOrder($index) }}
    //   </template>
    // </el-table-column>\n`;
    //     const dataTypeName = ApiUtils.getResultDataTypeName(tableDef.api);
    //     text += tableDef.cols.map(col => {
    //         return TableViewGenerator.generateTableColTemplate(tableDef, col, dataTypeName, tableDef.api);
    //     }).join('');
    //
    //     text += `  </el-table>\n`
    //
    //     if (tableDef.isPage) {
    //         text += `  <pagination v-show="totalRows > 0" :total="totalRows" v-model:page.sync="paging.pageNum"
    //           v-model:limit.sync="paging.pageSize" @pagination="getList"/>\n`;
    //     }
    //
    //     return text;
    // }

    // private static generateTableColTemplate(tableDef: TableDefinition, col: TableColDefinition, dataTypeName: string, api: ApiDefinition) {
    //     let text = '';
    //
    //     let conf = ([
    //         ['label', col.label],
    //         ['prop', col.prop],
    //         ['width', col.width],
    //         ['align', col.align],
    //     ] satisfies [string, string?][]).filter(isStrTuple2);
    //
    //     text += `    <el-table-column ${conf.map(([k, v]) => `${k}="${v}"`).join(' ')}`;
    //
    //     if (col.type === TableColType.TEXT) {
    //         text += '/>\n';
    //     } else {
    //         text += '>\n';
    //         text += TableViewGenerator.colTemplate[col.type]?.(col, dataTypeName);
    //         text += '    </el-table-column>\n';
    //     }
    //     if (tableDef.colActBtnArr.length > 0) {
    //         text += `    <el-table-column label="操作" width="100" fixed="right" align="center">`
    //         text += `      <template #default="{ row }: { row: ${dataTypeName} }">\n`;
    //         text += tableDef.colActBtnArr.map(btn => {
    //             return TableViewGenerator.colOperateTemplate[btn](col, dataTypeName, api);
    //         }).join('\n');
    //         text += `      </template>\n`;
    //         text += `    </el-table-column>\n`;
    //     }
    //     return text;
    // }

    // private static generateScriptImportLines({tableDef}: TableViewDefinition) {
    //     let text = '\n';
    //     let importInfo = emptyImportLines();
    //     addNewImport({importName: "cloneDeep", importPath: "lodash-es"}, importInfo);
    //     // TODO: 以下两项可改成根据配置按需添加
    //     addNewImport({importName: "useTableIndex", importPath: "@/utils"}, importInfo);
    //     addNewImport({importName: "fileUrl", importPath: "@/utils/file"}, importInfo);
    //     addNewImport({importName: "COMMON_KEYS", importPath: "@/constants/common"}, importInfo);
    //     if (tableDef.isPage) {
    //         addNewImport({importName: "IPagingParams", importPath: "@/dataType/common"}, importInfo, true);
    //     }
    //
    //     let dataTypeDef = ApiUtils.getResultDataType(tableDef.api);
    //     if (dataTypeDef) {
    //         getTypeImportsFrom(dataTypeDef, importInfo);
    //     }
    //     text += generateImportLines(importInfo);
    //
    //     return text;
    // }

//     private static generateScriptTableCommon(tableViewDefinition: TableViewDefinition) {
//         let {tableDef} = tableViewDefinition;
//         let dataTypeDef = ApiUtils.getResultDataType(tableDef.api);
//         let dataTypeStr = dataTypeDef ? tsTypeString(dataTypeDef) : 'unknown';
//
//         return `
// const {INJECT_QUERY_LIST_PARAM} = COMMON_KEYS;
//
// const showSearch = defineModel<boolean>({
//     default: true,
// });
//
// const { ${tableDef.dataName} = [], totalRows = 0 } = defineProps<{
//     ${tableDef.dataName}: ${dataTypeStr}[];
//     totalRows: number;
//     loading: boolean
// }>();
//
// const selected = ref<${dataTypeStr}[]>([]);
// const notSingle = computed(() => selected.value.length !== 1);
// const notMulti = computed(() => selected.value.length === 0);
//
// function handleSelectionChange(selection: ${dataTypeStr}[]) {
//     selected.value = selection;
// }
//
// const paging = inject<Ref<Required<IPagingParams>>>(INJECT_QUERY_LIST_PARAM, () => ref({
//     pageSize: 10,
//     pageNum: 1,
// }), true);
//
// const calcOrder = useTableIndex(paging as Ref<IPagingParams>);
// `
//     }

//     private static generateActionEvents(tableViewDefinition: TableViewDefinition) {
//         let {tableDef} = tableViewDefinition;
//         let dataTypeDef = ApiUtils.getResultDataType(tableDef.api);
//         let dataTypeStr = dataTypeDef ? tsTypeString(dataTypeDef) : 'unknown';
//         let eventSet = new Set<string>(['updateList']);
//         tableViewDefinition.actBtnArr.forEach(btn => eventSet.add(TableViewGenerator.actionBtnEmits[btn]));
//         tableDef.colActBtnArr.forEach(btn => eventSet.add(TableViewGenerator.colOptBtnEmits[btn]));
//         let eventList = [...eventSet].map(event => ({
//             event, ...(TableViewGenerator.actionHandlers[event](event, dataTypeStr)),
//         }));
//
//         return `
// const emit = defineEmits<{
// ${eventList.map(({event, emit}) => `    ${event}: [${emit}];`).join('\n')}
// }>();
//
// ${eventList.map(({func}) => func).join('\n\n')}
// `;
//     }

    // private static generateScript(tableViewDefinition: TableViewDefinition) {
    //     let text = '\n<script setup lang="ts">';
    //
    //     text += TableViewGenerator.generateScriptImportLines(tableViewDefinition);
    //     text += TableViewGenerator.generateScriptTableCommon(tableViewDefinition);
    //     text += TableViewGenerator.generateActionEvents(tableViewDefinition);
    //
    //     text += '</script>\n'
    //     return text;
    // }
}