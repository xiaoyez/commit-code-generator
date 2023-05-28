import {DataEnum} from "../definition/DataEnum";
import {compileEjsTmp} from "../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../ejsTmp/EjsTmp";

export class DMLSqlGenerator {

    /**
     * 生成数据字典插入语句。
     * @param dataEnum
     */
    static generateDictInsertSql(dataEnum: DataEnum) {
        return compileEjsTmp(ejsTmp.dmlSqlGeneratorTmp,dataEnum);
    }
}