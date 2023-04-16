import {
    DomainTypeDefinition,
    IDomainPropertyDefinition,
    IPropertyDefinition,
    ObjectTypeDefinition
} from "./TypeDefinition";
import {TableCreateDefinition} from "../../db/definition/TableCreateDefinition";
import {config} from "../../config/Config";
import {typeMapper} from "./TypeMapper";
import {camelCase,upperFirst} from "lodash";
import {SqlType} from "../../db/definition/SqlType";
import {TimePattern} from "./TimePattern";
import {DataColumnDefinition} from "../../db/definition/DataColumnDefinition";

export class ObjectTypeDefinitionUtils {

    /**
     * 将表创建定义转换为对象定义。
     * @param tableCreateDefinition
     */
    static castTableCreateDefinitionToObjectTypeDefinition(tableCreateDefinition: TableCreateDefinition): ObjectTypeDefinition {
        const objectTypeDefinition = new ObjectTypeDefinition({
            className: upperFirst(camelCase(tableCreateDefinition.tableName)),
            packageName: config.domainPackage,
            properties: tableCreateDefinition.columns.map(column => {
                return ObjectTypeDefinitionUtils.castDataColumnDefinitionToIPropertyDefinition(column);
            })
        })
        return objectTypeDefinition;
    }

    static castDataColumnDefinitionToIPropertyDefinition(column: DataColumnDefinition): IPropertyDefinition {
        return {
            paramName: camelCase(column.name),
            paramType: {
                type: typeMapper[column.typeName]
            },
            paramDesc: column.comment,
            timePattern: column.typeName === SqlType.DATETIME ? TimePattern.DATETIME
                : column.typeName === SqlType.DATE ? TimePattern.DATE : undefined
        };
    }

    static castDataColumnDefinitionToIDomainPropertyDefinition(column: DataColumnDefinition): IDomainPropertyDefinition {
        const domainPropertyDefinition = ObjectTypeDefinitionUtils.castDataColumnDefinitionToIPropertyDefinition(column) as IDomainPropertyDefinition;
        if (column.isPrimaryKey) {
            domainPropertyDefinition.isPrimaryKey = column.isPrimaryKey;
        }
        if (column.autoIncrement) {
            domainPropertyDefinition.autoIncrement = column.autoIncrement;
        }
        return domainPropertyDefinition;
    }

    static castTableCreateDefinitionToDomainTypeDefinition(tableCreateDefinition: TableCreateDefinition): DomainTypeDefinition {
        const domainTypeDefinition = new DomainTypeDefinition({
            className: upperFirst(camelCase(tableCreateDefinition.tableName)),
            packageName: config.domainPackage,
            properties: tableCreateDefinition.columns.map(column => {
                return ObjectTypeDefinitionUtils.castDataColumnDefinitionToIDomainPropertyDefinition(column)
            }),
            comment: tableCreateDefinition.comment
        })
        return domainTypeDefinition;
    }
}