import {IPropertyDefinition, ObjectTypeDefinition} from "../../../../dto/definition/TypeDefinition";
import {JavaType} from "../../../../dto/definition/JavaType";
import {
    DictSelectInputControl,
    FilterFormItemDefinition,
    SelectInputControl,
    TextInputControl
} from "./FilterDefinition";
import {lowerFirst} from "lodash";
import {ObjectTypeDefinitionUtils} from "../../../../dto/definition/ObjectTypeDefinitionUtils";
import {singular} from "../../../../utils/StringUtils.js";
import {DataColumnDefinition} from "../../../../db/definition/DataColumnDefinition.js";

export class FilterDefinitionUtils {
    static castPropertyDefinitionToFilterFormItemDefinition(propertyDefinition: IPropertyDefinition): FilterFormItemDefinition {
        if (propertyDefinition.paramType.type === JavaType.String)
        {
            return {
                label: propertyDefinition.paramDesc || '',
                prop: propertyDefinition.paramName,
                inputControl: new TextInputControl(propertyDefinition.paramName, "请输入" + propertyDefinition.paramDesc || '')
            }
        }
        else if (propertyDefinition.paramType.type === JavaType.Integer)
        {
            return {
                label: propertyDefinition.paramDesc || '',
                prop: propertyDefinition.paramName,
                inputControl: FilterDefinitionUtils.castPropertyDefinitionToSelectInputControl(propertyDefinition)
            }
        }
        return undefined!;
    }

    private static castPropertyDefinitionToSelectInputControl(propertyDefinition: IPropertyDefinition) {

        if (propertyDefinition.enumType) {
            const ruoyiDict = propertyDefinition.enumType?.ruoyiDict;
            return new DictSelectInputControl(
                propertyDefinition.paramName,
                propertyDefinition.paramDesc || '',
                ruoyiDict ? ruoyiDict : '',
                singular(propertyDefinition.paramName)
            )
        } else if (propertyDefinition.foreignKey) {

            let listName = '';
            if (propertyDefinition.referenceTable)
                listName = lowerFirst(propertyDefinition.referenceTable.tableName) + 'List';
            let iterArrayType: ObjectTypeDefinition = undefined!;
            if (propertyDefinition.referenceTable)
                iterArrayType = ObjectTypeDefinitionUtils.castTableCreateDefinitionToObjectTypeDefinition(propertyDefinition.referenceTable);
            let key = '';
            if (propertyDefinition.referenceTable) {
                const pkCol = Object.values(propertyDefinition.referenceTable.columns).find(column => (column as DataColumnDefinition).isPrimaryKey) as DataColumnDefinition;
                key = pkCol?.name ? pkCol.name : '';
            }

            let value = '';
            if (propertyDefinition.referenceColumn) {
                if (typeof propertyDefinition.referenceColumn === 'string')
                    value = propertyDefinition.referenceColumn;
                else
                    value = propertyDefinition.referenceColumn.name;
            }

            return new SelectInputControl(
                propertyDefinition.paramName,
                `请选择`,
                listName,
                lowerFirst(iterArrayType.className),
                key,
                '', //这个必须手动配置
                value
            )
        }
        else
            return undefined!;
    }
}