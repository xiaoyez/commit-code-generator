import {
    SearchType,
    TopDictSelectSearchItemDefinition,
    TopInputSearchItemDefinition,
    TopSearchItemDefinition,
    TopSelectSearchItemDefinition
} from "./TopSearchItemDefinition";
import {ObjectTypeDefinitionUtils} from "../../../../dto/definition/ObjectTypeDefinitionUtils";
import {JavaType} from "../../../../dto/definition/JavaType";
import {IPropertyDefinition, ObjectTypeDefinition} from "../../../../dto/definition/TypeDefinition";
import {lowerFirst} from "lodash";

export class TopSearchDefinitionUtils {
    static castPropertyDefinitionToTopSearchItemDefinition(propertyDefinition: IPropertyDefinition): TopSearchItemDefinition {
        if (propertyDefinition.paramType.type === JavaType.String)
        {
            return TopInputSearchItemDefinition.create(propertyDefinition.paramDesc?propertyDefinition.paramDesc:'',propertyDefinition.paramName);
        }
        else if (propertyDefinition.paramType.type === JavaType.Integer)
        {
            return TopSearchDefinitionUtils.castPropertyDefinitionToTopSelectSearchItemDefinition(propertyDefinition);
        }
        return undefined!;
    }

    private static castPropertyDefinitionToTopSelectSearchItemDefinition(propertyDefinition: IPropertyDefinition) {
        if (propertyDefinition.enumType) {
            const ruoyiDict = propertyDefinition.enumType?.ruoyiDict;
            return TopDictSelectSearchItemDefinition.create(ruoyiDict ? ruoyiDict : '', propertyDefinition.paramName, {
                label: propertyDefinition.paramDesc ? propertyDefinition.paramDesc : '',
                placeholder: "请选择",
                prop: propertyDefinition.paramName,
                type: SearchType.SELECT
            })
        } else if (propertyDefinition.foreignKey) {

            let iterArrayName = '';
            if (propertyDefinition.referenceTable)
                iterArrayName = lowerFirst(propertyDefinition.referenceTable.tableName) + 'List';
            let iterArrayType: ObjectTypeDefinition = undefined!;
            if (propertyDefinition.referenceTable)
                iterArrayType = ObjectTypeDefinitionUtils.castTableCreateDefinitionToObjectTypeDefinition(propertyDefinition.referenceTable);
            let keyProp = '';
            if (propertyDefinition.referenceTable) {
                const pkCol = propertyDefinition.referenceTable.columns.find(column => column.isPrimaryKey);
                keyProp = pkCol?.name ? pkCol.name : '';
            }

            let valueProp = '';
            if (propertyDefinition.referenceColumn) {
                if (typeof propertyDefinition.referenceColumn === 'string')
                    valueProp = propertyDefinition.referenceColumn;
                else
                    valueProp = propertyDefinition.referenceColumn.name;
            }

            return new TopSelectSearchItemDefinition({
                iterArrayName: iterArrayName,
                iterArrayType: iterArrayType,
                iterVarName: lowerFirst(iterArrayType.className),
                keyProp: keyProp,
                label: propertyDefinition.paramDesc ? propertyDefinition.paramDesc : '',
                labelProp: "",  //这个必须手动配置
                placeholder: "请选择",
                prop: propertyDefinition.paramName,
                type: SearchType.SELECT,
                valueProp: valueProp

            })
        }
        else
            return undefined!;
    }
}