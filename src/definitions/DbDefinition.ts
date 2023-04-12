import {TableCreateDefinition} from "./TableCreateDefinition";

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

    constructor(props: IDbDefinition) {
        Object.assign(this, props);
    }
}