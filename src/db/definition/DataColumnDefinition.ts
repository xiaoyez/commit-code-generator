import {SqlType} from "./SqlType";
import {DataEnum} from "./DataEnum";
import {TableCreateDefinition} from "./TableCreateDefinition";

/**
 * 数据库表的列定义。
 */
export interface IDataColumnDefinition extends IDataColBase {
    /**
     * 列的数据类型。
     */
    typeName: SqlType
    /**
     * 数据类型的长度。表示数值时代表m；表示定长字符串时代表n。
     */
    length?: number
    /**
     * 数据类型的精度。表示浮点数和定点数时代表d。
     */
    precision?: number
    /**
     * 是否为无符号数。
     */
    unsigned?: boolean

    /**
     * 字段是否是枚举类型。
     * 枚举类型的typeName应为int。
     */
    isEnum?: boolean;

    /**
     * 枚举类型
     */
    enumType?: DataEnum;

    /**
     * 是否为外键
     */
    foreignKey?: boolean;

    /**
     * 外键对应的表
     */
    referenceTable?: TableCreateDefinition;

    /**
     * 外键对应的列
     */
    referenceColumn?: string| DataColumnDefinition;
}

/**
 * 数据库表的列基础定义。
 */
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

// 整型SqlType
type IntType = SqlType.TINYINT | SqlType.SMALLINT | SqlType.MEDIUMINT | SqlType.INT | SqlType.INTEGER| SqlType.BIGINT;
// 浮点型SqlType
type FloatType = SqlType.FLOAT| SqlType.DOUBLE;
// 定点型SqlType
type FixedType = SqlType.DECIMAL| SqlType.NUMERIC;
// 字符串型SqlType
type StringType = SqlType.CHAR| SqlType.VARCHAR;
// 特定SqlType
type SpecialType = IntType|FloatType|FixedType|StringType;
// 其他SqlType
type OtherSqlType = Exclude<SqlType,SpecialType>

/**
 * 整型数据列定义。
 */
interface IDataIntBase extends IDataColBase {
    /**
     * 列的数据类型。
     */
    typeName: IntType
    /**
     * 数据类型的长度。表示数值时代表m；表示定长字符串时代表n。
     */
    length?: number
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

/**
 * 整型数据列定义。
 */
interface IDataIntCol extends IDataIntBase {
    /**
     * 字段是否是枚举类型。\
     * 枚举类型的typeName应为int。
     */
    isEnum: false;

    /**
     * 自增
     */
    autoIncrement?: boolean;
}

/**
 * 整型数据枚举列定义。
 */
interface IDataIntEnumCol extends IDataIntBase {
    /**
     * 字段是否是枚举类型。\
     * 枚举类型的typeName应为int。
     */
    isEnum: true;

    /**
     * 枚举类型
     */
    enumType?: DataEnum;
}

/**
 * 浮点型数据列定义。
 */
interface IDataRealCol extends IDataColBase {
    /**
     * 列的数据类型。
     */
    typeName: FloatType | FixedType
    /**
     * 数据类型的长度。表示数值时代表m；表示定长字符串时代表n。
     */
    length?: number
    /**
     * 数据类型的精度。表示浮点数和定点数时代表d。
     */
    precision?: number
}

/**
 * 字符串型数据列定义。
 */
interface IDataStringCol extends IDataColBase {
    /**
     * 列的数据类型。
     */
    typeName: StringType
    /**
     * 数据类型的长度。表示数值时代表m；表示定长字符串时代表n。
     */
    length?: number
}

/**
 * 其他数据列定义。
 */
interface IDataOtherCol extends IDataColBase {
    /**
     * 列的数据类型。
     */
    typeName: OtherSqlType
}

// 数据列类型
export type IDataColumnType = IDataIntCol | IDataIntEnumCol | IDataRealCol | IDataStringCol | IDataOtherCol;


/**
 * 数据库表的列定义。
 */
export class DataColumnDefinition implements IDataColumnDefinition {
    name!: string;
    typeName!: SqlType;
    nullable!: boolean;
    isEnum:boolean = false;
    /**
     * 数据类型的长度。表示数值时代表m；表示定长字符串时代表n。
     */
    length?: number
    /**
     * 数据类型的精度。表示浮点数和定点数时代表d。
     */
    precision?: number
    /**
     * 是否为无符号数。
     */
    unsigned?: boolean

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

    /**
     * 自增
     */
    autoIncrement?: boolean;    /**
     * 枚举类型
     */
    enumType?: DataEnum;

    /**
     * 是否为外键
     */
    foreignKey?: boolean;

    /**
     * 外键对应的表
     */
    referenceTable?: TableCreateDefinition;

    /**
     * 外键对应的列
     */
    referenceColumn?: string| DataColumnDefinition;




    constructor(props: IDataColumnType) {
        Object.assign(this, props);
    }


}