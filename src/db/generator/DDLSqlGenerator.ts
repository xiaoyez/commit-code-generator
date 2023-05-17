import {DbDefinition} from "../definition/DbDefinition";
import {TableCreateDefinition} from "../definition/TableCreateDefinition";
import {DataColumnDefinition} from "../definition/DataColumnDefinition";
import {JoinType, ViewCreateDefinition} from "../definition/ViewCreateDefinition";

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
        let sql = '';
        sql += `CREATE DATABASE ${dbDefinition.dbName} DEFAULT CHARACTER SET ${dbDefinition.charset};`;
        return sql;
    }

    static generateCreateTableSql<T extends Record<string, DataColumnDefinition>>(table: TableCreateDefinition<T>) {
        let sql = '';
        sql += `drop table if exists \`${table.tableName}\`;` + '\n'
        sql += `CREATE TABLE ${table.tableName} (` + '\n';
        if (table.columns)
        {
            sql += Object.values(table.columns).map(col => {
                return '\t'+DDLSqlGenerator.generateCreateColumnSql(col);
            }).join(',\n')||'';
        }
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
        sql += col.defaultValue?` DEFAULT '${col.defaultValue}'`:'';
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

    static generateCreateViewSql(view: ViewCreateDefinition) {
        let sql = '';
        sql += `create view \`${view.name}\` as \n`;
        sql += `select \n`;
        // 添加view的列
        sql += view.items.map(item => {
            const alias = item.alias || item.table.tableName;
            return item.cols.map(col => {
                let colName = '';
                if (col.col instanceof DataColumnDefinition)
                    colName = col.col.name;
                else if (col.col === '*')
                    colName = col.col
                return `\t${alias}.${colName}${col.alias?` as ${col.alias}`:''}`;
            }).join(',\n')
        }).join(',\n');

        // 处理view的from的表
        sql += '\nfrom ';
        sql += view.items.filter(item => item.joinType === JoinType.FROM)
            .map(item => {
                return `${item.table.tableName}${item.alias?` as ${item.alias}`:''}`
            }).join(',');
        sql += '\n';

        // 处理view的join的表
        view.items.filter(item => item.joinType !== JoinType.FROM)
            .forEach(item => {
                sql += `${item.joinType} ${item.table.tableName}${item.alias?` as ${item.alias}`:''}\n${item.on? `on ${item.on}\n`:''}`
            })

        return sql;
    }
}