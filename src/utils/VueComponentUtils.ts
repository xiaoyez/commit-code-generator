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

    let importLines = getImportLinesRecord(getTypeImportsFrom(api.params!));
    let queryTypeName = tsTypeString(api.params!);

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
    elType: string;
    icon: string;
    click: string;
    actPermi: string;
    text: string;
    disabled?: string;
}

const tableActBtnConf = {
    [ActBtn.ADD]: {
        elType: 'primary',
        icon: 'Plus',
        click: 'handleAdd()',
        actPermi: 'add',
        text: '新增',
    },
    [ActBtn.EDIT]: {
        elType: 'success',
        icon: 'Edit',
        click: 'handleUpdate()',
        actPermi: 'edit',
        text: '修改',
        disabled: 'notSingle',
    },
    [ActBtn.REMOVE]: {
        elType: 'danger',
        icon: 'Delete',
        click: 'handleDelete()',
        actPermi: 'remove',
        text: '删除',
        disabled: 'notMulti',
    },
    [ActBtn.EXPORT]: {
        elType: 'warning',
        icon: 'Download',
        click: 'handleExport()',
        actPermi: 'export',
        text: '导出',
    }
} as Record<ActBtn, ActBtnInfo>;

interface ColActBtnInfo {
    icon: string;
    click: string;
    actPermi?: string;
    text: string;
}

const tableColActBtnConf = {
    [ColActBtn.EDIT]: {
        icon: 'Edit',
        click: 'handleUpdate(row)',
        actPermi: 'edit',
        text: '修改',
    },
    [ColActBtn.REMOVE]: {
        icon: 'Delete',
        click: 'handleDelete(row)',
        actPermi: 'remove',
        text: '删除',
    },
    [ColActBtn.INFO]: {
        icon: 'View',
        click: 'showInfo(row)',
        text: '详情',
    },
} as Record<ColActBtn, ColActBtnInfo>;

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
    const colActBtnList = colActBtnArr.map(actBtn => tableColActBtnConf[actBtn]);

    return {
        tableDef,
        api,
        permiPrefix,
        actBtnList,
        dataName,
        dataTypeName,
        tableColumns,
        colActBtnList,
    };
}