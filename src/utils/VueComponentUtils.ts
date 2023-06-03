import {FilterDefinition} from "../frontend/view/definition/page/FilterDefinition";
import {getApiImportsFrom, getImportLinesRecord, getTypeImportsFrom} from "./TSImportUtils";
import {tsTypeString} from "./TypeUtils";
import {filterInputViewModel, FilterInputVM, FilterTimeRangeVM} from "./VueControlUtils";
import {
    ActBtn,
    ColActBtn,
    TableColDefinition,
    TableViewDefinition
} from "../frontend/view/definition/page/TableViewDefinition";
import {config} from "../config/Config";
import {prefix2Module} from "../api/utils/ModuleUtils";
import {ApiUtils} from "../api/utils/ApiUtils";
import {TypeDefinition} from "../dto/definition/TypeDefinition";
import {DataFormItemDefinition, FormDialogDefinition} from "../frontend/view/definition/page/FormDialogDefinition";
import {IndexDefinition} from "../frontend/view/definition/page/IndexDefinition";
import {FormItemDefinition} from "../frontend/view/definition/page/FormDefinition";

function filterCompVM(def: FormItemDefinition, modelName: string) {
    let {label, prop, inputControl} = def;
    return {
        label, prop, info: filterInputViewModel(modelName, inputControl)
    }
}

export function filterCompViewModel(filterDefinition: FilterDefinition) {
    const {
        filterFormDefinition: filterFormDef,
        api,
    } = filterDefinition;

    const modelName = filterFormDef.modelName || 'queryParams'
    const refName = filterFormDef.refName || 'queryForm'
    const vShowName = filterFormDef.vShowName || 'showSearch';

    let items = filterFormDef.items
        .map(item => filterCompVM(item, modelName));

    function isRange(info: FilterInputVM): info is FilterTimeRangeVM {
        return info.tmpName === 'filterDateControlTmp' && info.isRange;
    }

    let dateRanges = items
        .map(({info}) => info)
        .filter(isRange);

    let importLines = getImportLinesRecord(getTypeImportsFrom(api.params!.type as TypeDefinition));
    let queryTypeName = tsTypeString(api.params!.type as TypeDefinition);

    return {
        items,
        api,
        modelName,
        refName,
        vShowName,
        dateRanges,
        importLines,
        queryTypeName,
    }
}

interface ActBtnInfo {
    emit: string;
    elType: string;
    icon: string;
    click: string;
    actPermi: string;
    text: string;
    disabled?: string;
}

const tableActBtnConf = {
    [ActBtn.ADD]: {
        emit: 'onClickAdd',
        elType: 'primary',
        icon: 'Plus',
        click: 'handleAdd()',
        actPermi: 'add',
        text: '新增',
    },
    [ActBtn.EDIT]: {
        emit: 'onClickUpdate',
        elType: 'success',
        icon: 'Edit',
        click: 'handleUpdate()',
        actPermi: 'edit',
        text: '修改',
        disabled: 'notSingle',
    },
    [ActBtn.REMOVE]: {
        emit: 'onClickDelete',
        elType: 'danger',
        icon: 'Delete',
        click: 'handleDelete()',
        actPermi: 'remove',
        text: '删除',
        disabled: 'notMulti',
    },
    [ActBtn.EXPORT]: {
        emit: 'onClickExport',
        elType: 'warning',
        icon: 'Download',
        click: 'handleExport()',
        actPermi: 'export',
        text: '导出',
    }
} as Record<ActBtn, ActBtnInfo>;

interface ColActBtnInfo {
    emit: string;
    icon: string;
    click: string;
    actPermi?: string;
    text: string;
}

const tableColActBtnConf = {
    [ColActBtn.EDIT]: {
        emit: 'onClickUpdate',
        icon: 'Edit',
        click: 'handleUpdate(row)',
        actPermi: 'edit',
        text: '修改',
    },
    [ColActBtn.REMOVE]: {
        emit: 'onClickDelete',
        icon: 'Delete',
        click: 'handleDelete(row)',
        actPermi: 'remove',
        text: '删除',
    },
    [ColActBtn.INFO]: {
        emit: 'onClickShowInfo',
        icon: 'View',
        click: 'showInfo(row)',
        text: '详情',
    },
} as Record<ColActBtn, ColActBtnInfo>;

const actionHandlers: Record<string, (emit: string, dataTypeStr: string) => {
    event: string, emit: string,
    funcName: string, data: string
}> = {
    updateList: emit => ({
        emit: "params: IPagingParams",
        funcName: 'getList',
        event: emit,
        data: 'paging.value',
    }),
    onClickAdd: emit => ({
        emit: "",
        funcName: 'handleAdd',
        event: emit,
        data: "void",
    }),
    onClickUpdate: (emit, typeDef) => ({
        emit: `val: ${typeDef}`,
        funcName: 'handleUpdate',
        event: emit,
        data: "single",
    }),
    onClickShowInfo: (emit, typeDef) => ({
        emit: `val: ${typeDef}`,
        funcName: 'showInfo',
        event: emit,
        data: "single",
    }),
    onClickDelete: (emit, typeDef) => ({
        emit: `val: ${typeDef}[]`,
        funcName: 'handleDelete',
        event: emit,
        data: "multi",
    }),
    onClickExport: emit => ({
        emit: "",
        funcName: 'handleExport',
        event: emit,
        data: "void",
    }),
}

function isStrTuple2(i: [string, string?]): i is [string, string] {
    return !!i[1];
}

function tableColViewModel(col: TableColDefinition) {
    const {
        type,
        dictName,
        prop
    } = col;

    let columnProps = ([
        ['label', col.label],
        ['prop', col.prop],
        ['width', col.width],
        ['align', col.align],
    ] satisfies [string, string?][]).filter(isStrTuple2);

    return {
        columnProps,
        type,
        prop,
        dictName,
    };
}

/**
 * TableView组件对外事件相关信息, 返回值中events键为事件名，值为是否是表格内操作触发
 * @param tableViewDefinition
 */
function tableViewEvents(tableViewDefinition: TableViewDefinition) {
    const {tableDef, actBtnArr} = tableViewDefinition;
    const {colActBtnArr} = tableDef;
    const actBtnList = (actBtnArr || [])
        .map(actBtn => tableActBtnConf[actBtn]);
    const colActBtnList = (colActBtnArr || [])
        .map(actBtn => tableColActBtnConf[actBtn]);
    const toEntry = (isCol: boolean) =>
        ({emit}: {emit: string}) =>
            [emit, true] as [string, boolean];

    const events = new Map([
        ['updateList', false],
        ...actBtnList.map(toEntry(false)),
        ...colActBtnList.map(toEntry(true)),
    ]);

    return {
        actBtnList,
        colActBtnList,
        events,
    }
}

export function tableViewCompViewModel(tableViewDefinition: TableViewDefinition) {
    const {tableDef} = tableViewDefinition;
    const {api, dataName, cols} = tableDef;
    const dataTypeName = ApiUtils.getResultDataTypeName(api)
    const modulePermi = prefix2Module(api.module?.baseUrlPrefix);
    const permiPrefix = `${config.projectName}:${modulePermi}`;
    const tableColumns = cols.map(col => tableColViewModel(col));
    const importDataType = ApiUtils.getResultDataTypeImportRecord(api);
    const {actBtnList, colActBtnList, events} = tableViewEvents(tableViewDefinition);

    const eventList = [...events].map(([emit, curRow]) => ({
        ...actionHandlers[emit](emit, dataTypeName), curRow,
    }));

    return {
        tableDef,
        api,
        permiPrefix,
        actBtnList,
        dataName,
        dataTypeName,
        tableColumns,
        colActBtnList,
        importDataType,
        eventList,
    };
}

function formItemViewModule(def: DataFormItemDefinition, modelName: string) {
    let res = filterCompVM(def, modelName);
    res.info.displayJudge = def.disabledInEdit
        ? 'formType !== FORM_TYPE.ADD'
        : 'formType === FORM_TYPE.INFO';

    return res;
}

export function formDialogViewModel(formDialogDefinition: FormDialogDefinition) {
    const {formDefinition, width, infoApi, addApi, editApi} = formDialogDefinition;

    const modelName = formDefinition.modelName || 'form';
    const items = formDefinition.items.map(item => formItemViewModule(item, modelName));
    const rules = formDefinition.items
        .filter(it => it.rule)
        .map(({prop, rule}) => ({prop, rule}))

    const resultTypeName = ApiUtils.getResultDataTypeName(infoApi);

    const imports = getApiImportsFrom(infoApi);
    getApiImportsFrom(addApi, imports);
    getApiImportsFrom(editApi, imports);
    let resultType = ApiUtils.getResultDataType(infoApi);
    if (resultType) {
        getTypeImportsFrom(resultType, imports);
    }

    return {
        ...formDialogDefinition,
        modelName,
        width: width || '500px',
        items,
        rules,
        resultTypeName,
        importLines: getImportLinesRecord(imports),
    };
}

export function commonPageViewModel(pageDef: IndexDefinition) {
    let importData = getApiImportsFrom(pageDef.filter.api);
    let dataType = ApiUtils.getResultDataType(pageDef.tableView.tableDef.api);
    if (dataType) {
        getTypeImportsFrom(dataType, importData);
    }

    if (pageDef.deleteApi) {
        getApiImportsFrom(pageDef.deleteApi, importData);
    }

    return {
        ...pageDef,
        importLines: getImportLinesRecord(importData),
    }
}