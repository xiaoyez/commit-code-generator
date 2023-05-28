import {DbDefinition} from "../definition/DbDefinition";
import {TableCreateDefinition} from "../definition/TableCreateDefinition";
import {DataColumnDefinition} from "../definition/DataColumnDefinition";
import {JoinType, ViewCreateDefinition} from "../definition/ViewCreateDefinition";
import {compileEjsTmp} from "../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../ejsTmp/EjsTmp";

export class DDLSqlGenerator {

    /**
     * 生成完整数据库定义的SQL语句。 包括数据库创建语句、表创建语句、视图创建语句。
     * @param dbDefinition
     */
    static generateSql(dbDefinition: DbDefinition): string {
        return compileEjsTmp(ejsTmp.ddlSqlGeneratorTmp, dbDefinition);
    }

    /**
     * 生成数据库创建语句。
     * @param dbDefinition
     */
    static generateCreateDbSql(dbDefinition: DbDefinition): string {
        return compileEjsTmp(ejsTmp.dbCreateSqlTmp, dbDefinition);
    }

    /**
     * 生成表创建语句。
     * @param table
     */
    static generateCreateTableSql<T extends Record<string, DataColumnDefinition>>(table: TableCreateDefinition<T>) {
        return compileEjsTmp(ejsTmp.tableCreateSqlTmp, table);
    }

    /**
     * 生成视图创建语句。
     * @param view
     */
    static generateCreateViewSql(view: ViewCreateDefinition) {
        return compileEjsTmp(ejsTmp.viewCreateSqlTmp, view);
    }
}