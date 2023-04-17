import {
    DomainTypeDefinition,
    IDomainPropertyDefinition,
    IPropertyDefinition,
    ObjectTypeDefinition
} from "./TypeDefinition";
import {TableCreateDefinition} from "../../db/definition/TableCreateDefinition";
import {config} from "../../config/Config";
import {javaTypeMapper} from "./TypeMapper";
import {camelCase,upperFirst} from "lodash";
import {SqlType} from "../../db/definition/SqlType";
import {TimePattern} from "./TimePattern";
import {DataColumnDefinition} from "../../db/definition/DataColumnDefinition";
import {ViewCreateDefinition} from "../../db/definition/ViewCreateDefinition";

export class ObjectTypeDefinitionUtils {

    /**
     * 将表创建定义转换为对象定义。
     * @param tableCreateDefinition
     */
    static castTableCreateDefinitionToObjectTypeDefinition(tableCreateDefinition: TableCreateDefinition): ObjectTypeDefinition {
        const objectTypeDefinition = new ObjectTypeDefinition({
            className: ObjectTypeDefinitionUtils.castTableNameToClassName(tableCreateDefinition.tableName),
            properties: tableCreateDefinition.columns.map(column => {
                return ObjectTypeDefinitionUtils.castDataColumnDefinitionToIPropertyDefinition(column);
            })
        })
        return objectTypeDefinition;
    }

    /**
     * 将视图创建定义转换为对象定义。
     * @param viewCreateDefinition
     */
    static castViewCreateDefinitionToDomainTypeDefinition(viewCreateDefinition: ViewCreateDefinition): DomainTypeDefinition {
        const domainTypeDefinition = new DomainTypeDefinition({
            className: ObjectTypeDefinitionUtils.castTableNameToClassName(viewCreateDefinition.name),
            comment: viewCreateDefinition.comment,
            properties: ObjectTypeDefinitionUtils.createIDomainPropertyDefinitionsByViewCreateDefinition(viewCreateDefinition)
        })
        return domainTypeDefinition;
    }

    static createIDomainPropertyDefinitionsByViewCreateDefinition(viewCreateDefinition: ViewCreateDefinition): IDomainPropertyDefinition[] {
        const domainPropertyDefinitions: IDomainPropertyDefinition[] = [];
        viewCreateDefinition.items.forEach(item => {
            item.cols.forEach(col => {
                if (col.col === '*') {
                    item.table.columns.forEach(column => {
                        domainPropertyDefinitions.push(ObjectTypeDefinitionUtils.castDataColumnDefinitionToIDomainPropertyDefinition(column));
                    })
                }
                else
                {
                    const domainPropertyDefinition = ObjectTypeDefinitionUtils.castDataColumnDefinitionToIDomainPropertyDefinition(col.col);
                    domainPropertyDefinition.paramName = col.alias || domainPropertyDefinition.paramName;
                    domainPropertyDefinitions.push(domainPropertyDefinition);
                }
            })
        })
        return domainPropertyDefinitions
    }

    static castTableNameToClassName(tableName: string): string {
        return upperFirst(camelCase(tableName));
    }

    static castDataColumnDefinitionToIPropertyDefinition(column: DataColumnDefinition): IPropertyDefinition {
        return {
            paramName: camelCase(column.name),
            paramType: {
                type: javaTypeMapper[column.typeName]
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