import {JavaType} from "./JavaType";
import {SqlType} from "../../db/definition/SqlType";

/**
 * Java类型映射器。用于将SqlType映射为JavaType。
 */
export const javaTypeMapper = {
    [SqlType.INT]: JavaType.Integer,
    [SqlType.VARCHAR]: JavaType.String,
    [SqlType.DATE]: JavaType.Date,
    [SqlType.DATETIME]: JavaType.Date,
    [SqlType.TIMESTAMP]: JavaType.Date,
    [SqlType.BIGINT]: JavaType.Long,
    [SqlType.FLOAT]: JavaType.Float,
    [SqlType.DOUBLE]: JavaType.Double,
    [SqlType.DECIMAL]: JavaType.Double,
    [SqlType.TINYINT]: JavaType.Integer,
    [SqlType.SMALLINT]: JavaType.Integer,
    [SqlType.MEDIUMINT]: JavaType.Integer,
    [SqlType.BIT]: JavaType.Boolean,
    [SqlType.BOOLEAN]: JavaType.Boolean,
    [SqlType.CHAR]: JavaType.String,
    [SqlType.TEXT]: JavaType.String,
    [SqlType.LONGTEXT]: JavaType.String,
    [SqlType.MEDIUMTEXT]: JavaType.String,
    [SqlType.TINYTEXT]: JavaType.String,
    [SqlType.BLOB]: JavaType.String,
    [SqlType.LONGBLOB]: JavaType.String,
    [SqlType.MEDIUMBLOB]: JavaType.String,
    [SqlType.TINYBLOB]: JavaType.String,
    [SqlType.ENUM]: JavaType.Integer,
    [SqlType.SET]: JavaType.String,
    [SqlType.TIME]: JavaType.Date,
    [SqlType.YEAR]: JavaType.Integer,
    [SqlType.JSON]: JavaType.String,

} as Record<SqlType, JavaType>;

/**
 * ts类型映射器。用于将JavaType映射为ts的数据类型
 */
export const tsTypeMapper = {
    [JavaType.Boolean]: 'boolean',
    [JavaType.Byte]: 'number',
    [JavaType.Short]: 'number',
    [JavaType.Integer]: 'number',
    [JavaType.Long]: 'bigint',
    [JavaType.Float]: 'number',
    [JavaType.Double]: 'number',
    [JavaType.Character]: 'string',
    [JavaType.String]: 'string',
    [JavaType.Date]: 'Date',
    [JavaType.List]: 'Array',
} as Record<JavaType, string>;

