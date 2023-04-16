import {TableCreateDefinition} from "./TableCreateDefinition";
import {ViewCreateDefinition} from "./ViewCreateDefinition";

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

export class DbDefinition implements IDbDefinition{

    dbName!: string;
    charset = 'utf8';

    tables: TableCreateDefinition[] = [];
    views: ViewCreateDefinition[] = [];

    constructor(props: IDbDefinition) {
        Object.assign(this, props);
    }
}