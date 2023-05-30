import {DMLSqlGenerator} from "../src/db/generator/DMLSqlGenerator";
import {memberStatusEnumDef} from "./common";

test('generate dml sql', () => {
    const sql = DMLSqlGenerator.generateDictInsertSql(memberStatusEnumDef);
    console.log(sql);
})