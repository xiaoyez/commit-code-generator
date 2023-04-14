import {ObjectTypeDefinition} from "./TypeDefinition";
import {TableCreateDefinition} from "../../db/definition/TableCreateDefinition";
import {config} from "../../config/Config";
import {typeMapper} from "./TypeMapper";
import camelCase from "lodash/camelCase";

export class ObjectDefinitionUtils {

    /**
     * 将表创建定义转换为对象定义。
     * @param tableCreateDefinition
     */
    static castTableCreateDefinitionToObjectTypeDefinition(tableCreateDefinition: TableCreateDefinition): ObjectTypeDefinition {
        const objectTypeDefinition = new ObjectTypeDefinition({
            className: tableCreateDefinition.tableName,
            packageName: config.domainPackage,
            properties: tableCreateDefinition.columns.map(column => {
                return {
                    paramName: camelCase(column.name),
                    paramType: {
                        type: typeMapper[column.typeName]
                    },
                    paramDesc: column.comment
                }
            })
        })
        return objectTypeDefinition;
    }
}