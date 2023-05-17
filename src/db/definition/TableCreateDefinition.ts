import {DataColumnDefinition, IDataColumnType} from "./DataColumnDefinition";
import {SqlType} from "./SqlType";


/**
 * 表示用于创建数据库表的表定义。
 */
interface ITbTableCreateDefinition<T extends Record<string, DataColumnDefinition>> {

    /**
     * 表的名称。
     */
    tableName: string;

    /**
     * 表注释
     */
    comment: string;

    /**
     * 字符编码
     */
    charset?: string;

    /**
     * 表的列定义数组。
     */
    columns: T;

}

export class TableCreateDefinition<T extends Record<string, DataColumnDefinition> = any> implements ITbTableCreateDefinition<T> {
    tableName!: string;
    comment!: string;
    columns: T;

    charset: string = 'utf8';

    constructor(props: ITbTableCreateDefinition<T>) {
        this.columns = {} as T
        Object.assign(this, props);
        for (let key in props.columns)
        {
            let def = props.columns[key];
            if(def instanceof DataColumnDefinition)
            {
                this.columns[key] = def;
            }
            else
                this.columns[key] = new DataColumnDefinition(def as IDataColumnType) as T[typeof key]
        }
    }
}
