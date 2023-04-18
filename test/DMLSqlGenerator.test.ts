import {DMLSqlGenerator} from "../src/db/generator/DMLSqlGenerator";
import {dataEnum} from "./DDLSqlGenerator.test";

test('generate dml sql', () => {
    const sql = DMLSqlGenerator.generateDictInsertSql(dataEnum);
    console.log(sql);
})