import {
    DomainTypeDefinition,
    IDomainPropertyDefinition,
    IPropertyDefinition,
    ObjectTypeDefinition,
    TypeDefinition
} from "../../../../dto/definition/TypeDefinition";
import {JavaType} from "../../../../dto/definition/JavaType";
import {
    DateInputControl,
    DictSelectInputControl,
    FormItemDefinition,
    SelectInputControl,
    TextInputControl
} from "./FormDefinition";
import {camelCase, lowerFirst} from "lodash";
import {ObjectTypeDefinitionUtils} from "../../../../dto/definition/ObjectTypeDefinitionUtils";
import {singular} from "../../../../utils/StringUtils";
import {DataColumnDefinition} from "../../../../db/definition/DataColumnDefinition";
import {TableColDefinition, TableColType, TableDefinition} from "./TableViewDefinition";
import {ApiDefinition} from "../../../../api/definition/ApiDefinition";
import {TableDataInfoTypeDefinition} from "../../../../api/definition/TableDataInfoTypeDefinition";
import {FilterFormDefinition} from "./FilterDefinition";
import {contains} from "../../../../utils/ArrayUtils";
import {DataFormDefinition, DataFormFieldDefinition, DataFormItemDefinition} from "./FormDialogDefinition";
import {ApiUtils} from "../../../../api/utils/ApiUtils";
import {TimePattern} from "../../../../dto/definition/TimePattern";

export class ViewUtils {

    static castApiDefinitionToFilterFormDefinition(apiDefinition: ApiDefinition): FilterFormDefinition {
        let filterFormDefinition: FilterFormDefinition = {
            items: []
        }
        const apiParamType = apiDefinition.params?.type;
        if(apiParamType && apiParamType instanceof TypeDefinition && apiParamType.type instanceof ObjectTypeDefinition) {
            filterFormDefinition.items = apiParamType.type.properties.map(property=>ViewUtils.castPropertyDefinitionToFormItemDefinition(property))
        }
        return filterFormDefinition
    }

    static castPropertyDefinitionToFormItemDefinition(propertyDefinition: IPropertyDefinition): FormItemDefinition {
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
        else if (propertyDefinition.paramType.type === JavaType.Date) {

            return {
                label: propertyDefinition.paramDesc || '',
                prop: propertyDefinition.paramName,
                inputControl: ViewUtils.castPropertyDefinitionToDateInputControl(propertyDefinition)
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
                listName = lowerFirst(camelCase(propertyDefinition.referenceTable.tableName)) + 'List';
            let iterArrayType: ObjectTypeDefinition = undefined!;
            if (propertyDefinition.referenceTable)
                iterArrayType = ObjectTypeDefinitionUtils.castTableCreateDefinitionToObjectTypeDefinition(propertyDefinition.referenceTable);
            let key = '';
            if (propertyDefinition.referenceTable) {
                const pkCol = Object.values(propertyDefinition.referenceTable.columns).find(column => (column as DataColumnDefinition).isPrimaryKey) as DataColumnDefinition;
                key = pkCol?.name ? pkCol.name : '';
                key = lowerFirst(camelCase(key));
            }

            let value = '';
            if (propertyDefinition.referenceColumn) {
                if (typeof propertyDefinition.referenceColumn === 'string')
                    value = lowerFirst(camelCase(propertyDefinition.referenceColumn));
                else
                    value = lowerFirst(camelCase(propertyDefinition.referenceColumn.name));
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
        if (apiDefinition.result && apiDefinition.result.genericTypes && apiDefinition.result.genericTypes[0].type instanceof DomainTypeDefinition)
        {
            const cols = apiDefinition.result.genericTypes[0].type.properties
                .filter(prop => !(prop.isPrimaryKey && prop.autoIncrement))
                .map(property => ViewUtils.castDomainPropertyDefinitionToTableColDefinition(property));
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

    static castApiDefinitionToDataFormDefinition(apiDefinition: ApiDefinition, fields: Record<string, DataFormFieldDefinition>): DataFormDefinition {
        const resultType = ApiUtils.getResultDataType(apiDefinition) as TypeDefinition;
        const fieldNames = Object.keys(fields);
        const props = (resultType.type as ObjectTypeDefinition).properties.filter(prop => contains(fieldNames, prop.paramName));
        const items = props.map(prop => ViewUtils.castIPropertyDefinitionToDataFormItemDefinition(prop, fields[prop.paramName]));
        return {
            items
        }
    }

    private static castIPropertyDefinitionToDataFormItemDefinition(prop: IPropertyDefinition, fieldDefinition: DataFormFieldDefinition): DataFormItemDefinition {
        let item = ViewUtils.castPropertyDefinitionToFormItemDefinition(prop) as DataFormItemDefinition;
        item = {
            ...item,
            rule: fieldDefinition.rule,
            disabledInEdit: fieldDefinition.disabledInEdit,
        } as DataFormItemDefinition;
        if (item.inputControl instanceof SelectInputControl) {
            if (!item.inputControl.label && fieldDefinition.labelKey) {
                item.inputControl.label = fieldDefinition.labelKey;
            }
        }
        return item;
    }

    private static castPropertyDefinitionToDateInputControl(propertyDefinition: IPropertyDefinition) {
        const withTime = propertyDefinition.timePattern === TimePattern.DATETIME;
        return new DateInputControl(false,
            withTime,
            propertyDefinition.paramName,
            propertyDefinition.paramDesc || '',
            undefined,
            propertyDefinition.timePattern);
    }
}