import {DbDefinition} from "../definition/DbDefinition";
import {TableCreateDefinition} from "../definition/TableCreateDefinition";
import {DataColumnDefinition} from "../definition/DataColumnDefinition";
import {JoinType, ViewCreateDefinition} from "../definition/ViewCreateDefinition";
import {compileEjsTmp} from "../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../ejsTmp/EjsTmp";

export class DDLSqlGenerator {

    static generateSql(dbDefinition: DbDefinition): string {
        let sql = '';
        sql += dbDefinition?DDLSqlGenerator.generateCreateDbSql(dbDefinition):'';
        sql += '\n';
        sql += dbDefinition.tables?.reduce((sql,table)=>{
            return sql + DDLSqlGenerator.generateCreateTableSql(table) + '\n';
        },'')||'';

        sql += dbDefinition.views?.reduce((sql, view) =>{
            return sql + DDLSqlGenerator.generateCreateViewSql(view) + '\n';
        }, '')||'';

        return sql;
    }

    static generateCreateDbSql(dbDefinition: DbDefinition): string {
        return compileEjsTmp(ejsTmp.dbCreateSqlTmp, dbDefinition);
    }

    static generateCreateTableSql<T extends Record<string, DataColumnDefinition>>(table: TableCreateDefinition<T>) {
        return compileEjsTmp(ejsTmp.tableCreateSqlTmp, table);
    }


    static generateCreateViewSql(view: ViewCreateDefinition) {
        return compileEjsTmp(ejsTmp.viewCreateSqlTmp, view);
    }
}