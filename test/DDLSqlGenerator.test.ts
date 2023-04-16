import {DDLSqlGenerator} from "../src/db/generator/DDLSqlGenerator";
import {DataColumnDefinition} from "../src/db/definition/DataColumnDefinition";
import {SqlType} from "../src/db/definition/SqlType";
import {TableCreateDefinition} from "../src/db/definition/TableCreateDefinition";
import {DbDefinition} from "../src/db/definition/DbDefinition";
import {DataEnum} from "../src/db/definition/DataEnum";
import {DataEnumOption} from "../src/db/definition/DataEnumOption";

const idDefinition = new DataColumnDefinition({
    isEnum: false,
    name: "id",
    nullable: false,
    typeName: SqlType.INT,
    isPrimaryKey: true,
    autoIncrement: true,
    length: 11,
    comment: "主键"
});

const nameDefinition = new DataColumnDefinition({
    isEnum: undefined,
    name: "name",
    nullable: false,
    typeName: SqlType.VARCHAR,
    length: 20,
    comment: "名称"
});

const dataEnum = new DataEnum({
    name: "AuditStatusConstant",
    package: "com.cgmanage.web.modules.ypx.constants",
    options: [
        new DataEnumOption({
            description: "审核中",
            sign: "AUDITING",
            value: 1
        }),
        new DataEnumOption({
            description: "通过",
            sign: "PASS",
            value: 2
        }),new DataEnumOption({
            description: "拒绝",
            sign: "REJECT",
            value: 3
        }),
    ],

})

const statusEnumDefinition = new DataColumnDefinition({
    isEnum: true,
    name: "status",
    nullable: false,
    typeName: SqlType.INT,
    length: 11,
    enumType: dataEnum,
    comment: "状态"
});

const tableUserDefinition = new TableCreateDefinition({
    columns: [idDefinition, nameDefinition, statusEnumDefinition],
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