import {contains} from "../../../../utils/ArrayUtils";
import {ApiDefinition} from "../../../../api/definition/ApiDefinition";

export enum ActBtn {
    ADD ,EDIT,REMOVE,EXPORT
}

export interface TableViewDefinition {
    actBtnArr: ActBtn[],
    tableDef:  TableDefinition,
    fileName: string,
    packageName?: string,
}

export enum ColActBtn {
    EDIT,REMOVE,INFO
}

export class TableDefinition {
    dataName: string;
    cols: TableColDefinition[];
    isPage: boolean;
    api: ApiDefinition;
    colActBtnArr: ColActBtn[] = [];

    constructor(cols: TableColDefinition[], api: ApiDefinition, dataName?: string, isPage?: boolean) {
        this.dataName = dataName || 'valueList';
        this.cols = cols;
        this.isPage = isPage === undefined ? true : isPage;
        this.api = api;
    }

    setColTypeAsImg(...colProps: string[]) {
        this.cols.filter(col=> contains(colProps,col.prop))
            .forEach(col => col.type = TableColType.IMG)
    }

    addActBtn(...actBtns: ColActBtn[]) {
        this.colActBtnArr.push(...actBtns);
    }
}

export interface TableColDefinition {
    label: string;
    align?: string;
    prop: string;
    width?: string;
    type: TableColType;
    // TODO: 改为直接引用enum的定义，若没有ruoyiDict则添加DictDesc import
    dictName?: string;
}
export enum TableColType {
    TEXT,IMG,DICT
}
