import {contains} from "../../../../utils/ArrayUtils";
import {ApiDefinition} from "../../../../api/definition/ApiDefinition";

export enum ActBtn {
    ADD ,EDIT,REMOVE,EXPORT
}

export interface TableViewDefinition {
    actBtnArr: ActBtn[],
    tableDef:  TableColDefinition
}

export class TableDefinition {
    dataName: string;
    cols: TableColDefinition[];
    isPage: boolean;
    api: ApiDefinition;

    constructor(cols: TableColDefinition[], api: ApiDefinition,dataName?: string,  isPage?: boolean) {
        this.dataName = dataName || 'valueList';
        this.cols = cols;
        this.isPage = isPage === undefined ? true : isPage;
        this.api = api;
    }

    setColTypeAsImg(...colProps: string[]) {
        this.cols.filter(col=> contains(colProps,col.prop))
            .forEach(col => col.type = TableColType.IMG)
    }
}

export interface TableColDefinition {
    label: string;
    align?: string;
    prop: string;
    width?: string;
    type: TableColType;
    dictName?: string;
}
export enum TableColType {
    TEXT,IMG,DICT
}
