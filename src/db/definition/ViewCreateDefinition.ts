import {DataColumnDefinition} from "./DataColumnDefinition";
import {TableCreateDefinition} from "./TableCreateDefinition";

interface IViewCreateDefinition {

    name : string;
    items: IViewItemDefinition[];
}

export enum JoinType {
    FROM = 'from',
    LEFT_JOIN = 'left join',
    INNER_JOIN = 'inner join'
}

interface IViewItemDefinition {

    table: TableCreateDefinition;
    joinType: JoinType;
    alias?: string;
    cols: IViewColumnDefinition[];
    on?: string;

}

interface IViewColumnDefinition {
    col: DataColumnDefinition | '*';
    alias?: string
}

export class ViewCreateDefinition {
    name!: string;
    items!: IViewItemDefinition[];

    constructor(props: IViewCreateDefinition) {
        Object.assign(this,props)
    }

}