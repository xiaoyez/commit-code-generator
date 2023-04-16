import {DbDefinition} from "../definition/DbDefinition";
import {TableCreateDefinition} from "../definition/TableCreateDefinition";
import {DataColumnDefinition} from "../definition/DataColumnDefinition";

export class DDLSqlGenerator {

    static generateSql(dbDefinition: DbDefinition): string {
        let sql = '';
        sql += dbDefinition?DDLSqlGenerator.generateCreateDbSql(dbDefinition):'';
        sql += '\n';
        sql += dbDefinition.tables?.reduce((sql,table)=>{
            return sql + DDLSqlGenerator.generateCreateTableSql(table) + '\n';
        },'')||'';

        return sql;
    }

    static generateCreateDbSql(dbDefinition: DbDefinition): string {
        let sql = '';
        sql += `CREATE DATABASE ${dbDefinition.dbName} DEFAULT CHARACTER SET ${dbDefinition.charset};`;
        return sql;
    }

    static generateCreateTableSql(table: TableCreateDefinition) {
        let sql = '';
        sql += `drop table if exists \`${table.tableName}\`;` + '\n'
        sql += `CREATE TABLE ${table.tableName} (` + '\n';
        sql += table.columns?.map(( col) => {
            return '\t'+DDLSqlGenerator.generateCreateColumnSql(col);
        }).join(',\n')||'';
        sql += '\n)';
        sql += `ENGINE=InnoDB DEFAULT CHARSET=${table.charset} '${table.comment? `COMMENT=${table.comment}`:'' }';`
        return sql;
    }

    static generateCreateColumnSql(col: DataColumnDefinition) {
        let sql = '';
        sql += `\`${col.name}\` ${col.typeName}`;
        sql += col.length?`(${col.length}`:'';
        sql += col.precision?`,${col.precision}`:'';
        sql += col.length?`)`:'';
        sql += col.nullable?'':' NOT NULL';
        sql += col.unsigned?' UNSIGNED':'';
        sql += col.isPrimaryKey?' PRIMARY KEY':'';
        sql += col.autoIncrement?' AUTO_INCREMENT':'';
        if (col.comment) {
            let comment = col.comment;
            if (col.isEnum) {
                let desc = col.enumType?.options.map((option) =>
                    `${option.value}-${option.description}`).join(', ');
                comment += ` (${desc})`;
            }
            sql += ` COMMENT '${comment}'`;
        }
        return sql;
    }
}