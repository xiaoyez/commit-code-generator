import {DDLSqlGenerator} from "../src/parser/DDLSqlGenerator";
import {DataColumnDefinition} from "../src/definitions/DataColumnDefinition";
import {SqlType} from "../src/SqlType";

const columnDefinition = new DataColumnDefinition({
    isEnum: false,
    name: "id",
    nullable: false,
    typeName: SqlType.INT,
    isPrimaryKey: true,
    autoIncrement: true,
    length: 11,
});

test('test generateCreateColumnSql',()=>{
    console.log(DDLSqlGenerator.generateCreateColumnSql(columnDefinition));
});