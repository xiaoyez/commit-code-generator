import {SqlType} from './SqlType'
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
    columns: IDataColumn[];

}

class TbTableCreateDefinition implements ITbTableCreateDefinition {
    tableName: string;
    comment: string;
    columns: DataColumn[];

    constructor(props: ITbTableCreateDefinition) {
        Object.assign(this, props);
        this.columns = props.columns.map(def => {
            if (def instanceof DataColumn) {
                return def;
            } else {
                return new DataColumn(def as IDataColumnType);
            }
        })
    }
}

// 只定义我们需要的MySql类型的一个子集即可

type IntType = SqlType.TINYINT | SqlType.SMALLINT | SqlType.MEDIUMINT | SqlType.INT | SqlType.INTEGER| SqlType.BIGINT;
type FloatType = SqlType.FLOAT| SqlType.DOUBLE;
type FixedType = SqlType.DECIMAL| SqlType.NUMERIC;
type StringType = SqlType.CHAR| SqlType.VARCHAR;
type SpecialType = IntType|FloatType|FixedType|StringType;

type OtherSqlType = Exclude<SqlType,SpecialType>


interface IDataColBase {
    /**
     * 列的名称。
     */
    name: string
    /**
     * 列是否可为空。
     */
    nullable: boolean
    /**
     * 列的注释。
     */
    comment?: string
    /**
     * 列是否为主键。
     */
    isPrimaryKey?: boolean
    /**
     * 默认值。
     */
    defaultValue?: string
}

interface IDataIntBase extends IDataColBase {
    /**
     * 列的数据类型。
     */
    typeName: IntType
    /**
     * 数据类型的精度。表示整数时代表m；表示浮点数和定点数时代表d。
     */
    precision?: number
    /**
     * 是否为无符号数。
     */
    unsigned?: boolean
    /**
     * 字段是否是枚举类型。\
     * 枚举类型的typeName应为int。
     */
    isEnum: boolean;
}

interface IDataIntCol extends IDataIntBase {
    /**
     * 字段是否是枚举类型。\
     * 枚举类型的typeName应为int。
     */
    isEnum: false;
}

interface IDataIntEnumCol extends IDataIntBase {
    /**
     * 字段是否是枚举类型。\
     * 枚举类型的typeName应为int。
     */
    isEnum: true;

    /**
     * 枚举选项定义。
     */
    enumOptions: IDataEnumOption[];
}

interface IDataRealCol extends IDataColBase {
    /**
     * 列的数据类型。
     */
    typeName: FloatType | FixedType
    /**
     * 数据类型的长度。表示浮点数，定点数时代表m；表示定长字符串时代表n。
     */
    length?: number
    /**
     * 数据类型的精度。表示整数时代表m；表示浮点数和定点数时代表d。
     */
    precision?: number
}

interface IDataStringCol extends IDataColBase {
    /**
     * 列的数据类型。
     */
    typeName: StringType
    /**
     * 数据类型的长度。表示浮点数，定点数时代表m；表示定长字符串时代表n。
     */
    length?: number
}

interface IDataOtherCol extends IDataColBase {
    /**
     * 列的数据类型。
     */
    typeName: OtherSqlType
}

type IDataColumnType = IDataIntCol | IDataIntEnumCol | IDataRealCol | IDataStringCol | IDataOtherCol;

interface IDataColumn extends IDataColBase {
    /**
     * 列的数据类型。
     */
    typeName: SqlType
    /**
     * 数据类型的长度。表示浮点数，定点数时代表m；表示定长字符串时代表n。
     */
    length?: number
    /**
     * 数据类型的精度。表示整数时代表m；表示浮点数和定点数时代表d。
     */
    precision?: number
    /**
     * 是否为无符号数。
     */
    unsigned?: boolean

    /**
     * 字段是否是枚举类型。\
     * 枚举类型的typeName应为int。
     */
    isEnum?: boolean;

    /**
     * 枚举选项定义。
     */
    enumOptions?: IDataEnumOption[];
}

function isIntCol(def: IDataColumnType): def is IDataIntEnumCol {
    return (def as IDataIntBase).isEnum === true;
}

class DataColumn implements IDataColumn {
    name: string;
    typeName: SqlType;
    nullable: boolean;
    isEnum = false;
    enumOptions?: DataEnumOption[];

    constructor(props: IDataColumnType) {
        Object.assign(this, props);
        if (isIntCol(props)) {
            this.enumOptions = props.enumOptions.map(def => {
                if (def instanceof DataEnumOption) {
                    return def;
                } else {
                    return new DataEnumOption(def);
                }
            });
        }
    }


}

interface IDataEnumOption {
    /**
     * 枚举类型的存储值
     */
    value: number;
    /**
     * 枚举值对应的标识符。
     */
    sign: string;
    /**
     * 枚举值对应的描述。
     */
    description: string;
}

class DataEnumOption implements IDataEnumOption {
    /**
     * 枚举类型的存储值
     */
    value: number;
    /**
     * 枚举值对应的标识符。
     */
    sign: string;
    /**
     * 枚举值对应的描述。
     */
    description: string;

    constructor(props: IDataEnumOption) {
        Object.assign(this, props);
    }
}
