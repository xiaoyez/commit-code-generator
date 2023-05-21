import {
    DomainTypeDefinition,
    IDomainPropertyDefinition,
    IPropertyDefinition,
    ObjectTypeDefinition
} from "../../../../dto/definition/TypeDefinition";
import {JavaType} from "../../../../dto/definition/JavaType";
import {
    DictSelectInputControl,
    FilterFormItemDefinition,
    SelectInputControl,
    TextInputControl
} from "./FilterDefinition";
import {lowerFirst} from "lodash";
import {ObjectTypeDefinitionUtils} from "../../../../dto/definition/ObjectTypeDefinitionUtils";
import {singular} from "../../../../utils/StringUtils";
import {DataColumnDefinition} from "../../../../db/definition/DataColumnDefinition";
import {TableColDefinition, TableColType, TableDefinition} from "./TableViewDefinition";
import {ApiDefinition} from "../../../../api/definition/ApiDefinition";
import {TableDataInfoTypeDefinition} from "../../../../api/definition/TableDataInfoTypeDefinition";
import {FilterFormDefinition} from "./FilterDefinition";

export class ViewUtils {

    static castApiDefinitionToFilterFormDefinition(apiDefinition: ApiDefinition): FilterFormDefinition {
        let filterFormDefinition: FilterFormDefinition = {
            items: []
        }
        const apiParamType = apiDefinition.params?.type;
        if(apiParamType && apiParamType instanceof ObjectTypeDefinition) {
            filterFormDefinition.items = apiParamType.properties.map(property=>ViewUtils.castPropertyDefinitionToFilterFormItemDefinition(property))
        }
        return filterFormDefinition
    }

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
                inputControl: ViewUtils.castPropertyDefinitionToSelectInputControl(propertyDefinition)
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

    static castApiDefinitionToTableDefinition(apiDefinition: ApiDefinition): TableDefinition | null {
        if (apiDefinition.result && apiDefinition.result.genericTypes && apiDefinition.result.genericTypes[0] instanceof DomainTypeDefinition)
        {
            const cols = apiDefinition.result.genericTypes[0].properties.map(property => ViewUtils.castDomainPropertyDefinitionToTableColDefinition(property));
            return new TableDefinition(cols, apiDefinition, undefined ,apiDefinition.result instanceof TableDataInfoTypeDefinition);
        }
        return null;
    }

    private static castDomainPropertyDefinitionToTableColDefinition(property: IDomainPropertyDefinition): TableColDefinition {

        return {
            label: property.paramDesc || '',
            prop: property.paramName,
            // 若该字段是图片，需手动将type设为图片
            type: property.enumType?TableColType.DICT:TableColType.TEXT
        };
    }
}