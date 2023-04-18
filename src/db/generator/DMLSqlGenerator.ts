import {DataEnum} from "../definition/DataEnum";

export class DMLSqlGenerator {
    static generateDictInsertSql(dataEnum: DataEnum) {
        let sql = '';
        sql += `-- ${dataEnum.comment}\n`;
        sql += `delete from sys_dict_type where dict_type = '${dataEnum.ruoyiDict}';\n`;
        sql += `INSERT INTO  sys_dict_type `+
            `(\`dict_name\`, \`dict_type\`, \`status\`, \`create_by\`,\`create_time\`, \`update_by\`, \`update_time\`, \`remark\`)`
            + `VALUES ('${dataEnum.comment}','${dataEnum.ruoyiDict}','0','admin',now(),'','NULL','NULL')`;
        sql += '\n';

        sql += `delete from sys_dict_data where dict_type = '${dataEnum.ruoyiDict}';\n`;
        dataEnum.options.forEach((option, index) => {

            sql += `INSERT INTO \`sys_dict_data\` `+
                `(\`dict_sort\`, \`dict_label\`, \`dict_value\`, \`dict_type\`, \`css_class\`, \`list_class\`, \`is_default\`, \`status\`, \`create_by\`, \`create_time\`, \`update_by\`, \`update_time\`, \`remark\`)`
                + `VALUES (${index},'${option.description}','${option.value}','${dataEnum.ruoyiDict}',NULL,'default','N','0','admin',now(),'','NULL','NULL')`;
            sql += '\n';
        });
        return sql;
    }
}