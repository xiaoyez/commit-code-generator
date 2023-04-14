import {JavaType} from "./JavaType";
import {SqlType} from "../../db/definition/SqlType";

export const typeMapper = {
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

};

