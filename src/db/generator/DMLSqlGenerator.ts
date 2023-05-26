import {DataEnum} from "../definition/DataEnum";
import {compileEjsTmp} from "../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../ejsTmp/EjsTmp";

export class DMLSqlGenerator {
    static generateDictInsertSql(dataEnum: DataEnum) {
        return compileEjsTmp(ejsTmp.dmlSqlGeneratorTmp,dataEnum);
    }
}