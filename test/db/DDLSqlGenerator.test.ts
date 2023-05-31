import {DDLSqlGenerator} from "../../src/db/generator/DDLSqlGenerator";
import {tbMemberTableDef, testDbDef} from "../data/DbData";

test('test generateCreateTableSql', () => {
   const sql = DDLSqlGenerator.generateCreateTableSql(tbMemberTableDef);
   console.log(sql);
});

test('test generateCreateDbSql', () => {
    const sql = DDLSqlGenerator.generateCreateDbSql(testDbDef);
    console.log(sql);
});