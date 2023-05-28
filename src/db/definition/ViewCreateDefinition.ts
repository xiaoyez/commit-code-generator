import {DataColumnDefinition} from "./DataColumnDefinition";
import {TableCreateDefinition} from "./TableCreateDefinition";

/**
 * 视图定义。
 */
interface IViewCreateDefinition {

    name : string;
    items: IViewItemDefinition[];
    comment?: string;
}

/**
 * 表连接类型
 */
export enum JoinType {
    FROM = 'from',
    LEFT_JOIN = 'left join',
    INNER_JOIN = 'inner join'
}

/**
 * 视图项定义
 */
interface IViewItemDefinition<T extends Record<string, DataColumnDefinition> = any> {

    table: TableCreateDefinition<T>;
    joinType: JoinType;
    alias?: string;
    cols: IViewColumnDefinition[];
    on?: string;

}

/**
 * 视图列定义
 */
interface IViewColumnDefinition {
    col: DataColumnDefinition | '*';
    alias?: string
}

/**
 * 视图定义。
 */
export class ViewCreateDefinition {
    name!: string;
    comment?: string;
    items!: IViewItemDefinition[];

    constructor(props: IViewCreateDefinition) {
        Object.assign(this,props)
    }

}