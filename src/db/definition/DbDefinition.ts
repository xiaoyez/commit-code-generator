import {TableCreateDefinition} from "./TableCreateDefinition";
import {ViewCreateDefinition} from "./ViewCreateDefinition";

/**
 * 数据库定义。
 */
interface IDbDefinition {
    /**
     * 数据库名称。
     */
    dbName: string;

    /**
     * 数据库字符编码
     */
    charset?: string;

    /**
     * 数据库表定义数组。
     */
    tables: TableCreateDefinition[];
}

/**
 * 数据库定义。
 */
export class DbDefinition implements IDbDefinition{

    dbName!: string;
    charset = 'utf8';

    tables: TableCreateDefinition[] = [];
    views: ViewCreateDefinition[] = [];

    constructor(props: IDbDefinition) {
        Object.assign(this, props);
    }
}