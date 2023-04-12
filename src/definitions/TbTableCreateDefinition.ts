import {DataColumnDefinition, IDataColumnDefinition, IDataColumnType} from "./DataColumnDefinition";


/**
 * 表示用于创建数据库表的表定义。
 */
interface ITbTableCreateDefinition {

    /**
     * 表的名称。
     */
    tableName: string;

    /**
     * 表注释
     */
    comment: string;

    /**
     * 表的列定义数组。
     */
    columns: IDataColumnDefinition[];

}

export class TbTableCreateDefinition implements ITbTableCreateDefinition {
    tableName: string;
    comment: string;
    columns: DataColumnDefinition[];

    constructor(props: ITbTableCreateDefinition) {
        Object.assign(this, props);
        this.columns = props.columns.map(def => {
            if (def instanceof DataColumnDefinition) {
                return def;
            } else {
                return new DataColumnDefinition(def as IDataColumnType);
            }
        })
    }
}