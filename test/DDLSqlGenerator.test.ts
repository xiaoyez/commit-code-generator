import {DDLSqlGenerator} from "../src/db/generator/DDLSqlGenerator";
import {DataColumnDefinition} from "../src/db/definition/DataColumnDefinition";
import {SqlType} from "../src/db/definition/SqlType";
import {TableCreateDefinition} from "../src/db/definition/TableCreateDefinition";
import {DbDefinition} from "../src/db/definition/DbDefinition";

const idDefinition = new DataColumnDefinition({
    isEnum: false,
    name: "id",
    nullable: false,
    typeName: SqlType.INT,
    isPrimaryKey: true,
    autoIncrement: true,
    length: 11,
});

const nameDefinition = new DataColumnDefinition({
    isEnum: undefined,
    name: "name",
    nullable: false,
    typeName: SqlType.VARCHAR,
    length: 20
});

const tableUserDefinition = new TableCreateDefinition({
    columns: [idDefinition, nameDefinition],
    comment: "用户表",
    tableName: "tb_user"
});

const dbDefinition = new DbDefinition({
    dbName: "ypx", tables: [tableUserDefinition,tableUserDefinition]

});


test('test generateCreateColumnSql',()=>{
    console.log(DDLSqlGenerator.generateCreateColumnSql(idDefinition));
});

test('test generateCreateTableSql',()=>{
    console.log(DDLSqlGenerator.generateCreateTableSql(tableUserDefinition));
});

test('test generateCreateDbSql',()=>{
    console.log(DDLSqlGenerator.generateCreateDbSql(dbDefinition));
});

test('test generateSql',()=>{
    console.log(DDLSqlGenerator.generateSql(dbDefinition));
});