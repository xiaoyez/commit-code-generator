import {SqlType} from "./SqlType";
import {DataEnum} from "./DataEnum";

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
}

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

type IntType = SqlType.TINYINT | SqlType.SMALLINT | SqlType.MEDIUMINT | SqlType.INT | SqlType.INTEGER| SqlType.BIGINT;
type FloatType = SqlType.FLOAT| SqlType.DOUBLE;
type FixedType = SqlType.DECIMAL| SqlType.NUMERIC;
type StringType = SqlType.CHAR| SqlType.VARCHAR;
type SpecialType = IntType|FloatType|FixedType|StringType;

type OtherSqlType = Exclude<SqlType,SpecialType>

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

interface IDataOtherCol extends IDataColBase {
    /**
     * 列的数据类型。
     */
    typeName: OtherSqlType
}

export type IDataColumnType = IDataIntCol | IDataIntEnumCol | IDataRealCol | IDataStringCol | IDataOtherCol;


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

    constructor(props: IDataColumnType) {
        Object.assign(this, props);
    }


}