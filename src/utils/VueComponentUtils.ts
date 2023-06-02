import {FilterDefinition} from "../frontend/view/definition/page/FilterDefinition";
import {getImportLinesRecord, getTypeImportsFrom} from "./TSImportUtils";
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
import {FormDialogDefinition} from "../frontend/view/definition/page/FormDialogDefinition";

export function filterCompViewModel(filterDefinition: FilterDefinition) {
    const {
        filterFormDefinition: filterFormDef,
        api,
    } = filterDefinition;

    const modelName = filterFormDef.modelName || 'queryParams'
    const refName = filterFormDef.refName || 'queryForm'
    const vShowName = filterFormDef.vShowName || 'showSearch';

    let items = filterFormDef.items
        .map(({label, prop, inputControl}) => ({
            label, prop, info: filterInputViewModel(modelName, inputControl)
        }));

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

export function tableViewCompViewModel(tableViewDefinition: TableViewDefinition) {
    const {tableDef, actBtnArr} = tableViewDefinition;
    const {api, dataName, cols, colActBtnArr} = tableDef;
    const dataTypeName = ApiUtils.getResultDataTypeName(api)
    const actBtnList = (actBtnArr || [])
        .map(actBtn => tableActBtnConf[actBtn]);
    const modulePermi = prefix2Module(api.module?.baseUrlPrefix);
    const permiPrefix = `${config.projectName}:${modulePermi}`;
    const tableColumns = cols.map(col => tableColViewModel(col));
    const colActBtnList = (colActBtnArr || [])
        .map(actBtn => tableColActBtnConf[actBtn]);
    const importDataType = ApiUtils.getResultDataTypeImportRecord(api);
    const usingCurRow = new Set(colActBtnList.map(({emit}) => emit));
    const events = new Set([
        ...actBtnList.map(({emit}) => emit),
        ...usingCurRow,
    ]);
    const eventList = [...events]
        .map(emit => actionHandlers[emit](emit, dataTypeName))
        .map(info => ({
            ...info, curRow: usingCurRow.has(info.event),
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

export function formDialogViewModel(formDialogDefinition: FormDialogDefinition) {
    let {formDefinition, width} = formDialogDefinition;
    let {modelName} = formDefinition;
    return {
        ...formDialogDefinition,
        modelName: modelName || 'form',
        width: width || '500px',
    };
}