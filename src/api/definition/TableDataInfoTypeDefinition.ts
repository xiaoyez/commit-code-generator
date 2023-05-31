import {ITypeDefinition, ObjectTypeDefinition, TypeDefinition} from "../../dto/definition/TypeDefinition";
import {config} from "../../config/Config";
import {JavaType} from "../../dto/definition/JavaType";
import {ClassDefinition} from "../../java/definition/ClassDefinition";
import {DTOGenerator} from "../../dto/generator/DTOGenerator";

// TableDataInfo
const tableDataInfo = new ObjectTypeDefinition({
    className: "TableDataInfo",
    packageName: 'page',
    properties: []
})

/**
 * TableDataInfo类型定义
 */
interface ITableDataInfoTypeDefinition {
    genericType?: ITypeDefinition;
}

/**
 * TableDataInfo类型定义
 */
export class TableDataInfoTypeDefinition extends TypeDefinition {
    constructor(props: ITableDataInfoTypeDefinition) {
        super({type: tableDataInfo, genericTypes: props.genericType ? [props.genericType] : undefined});
    }

    /**
     * 创建TableDataInfo类型定义
     * @param genericType
     */
    static createTableDataInfo(genericType: JavaType|ObjectTypeDefinition) {
        return new TableDataInfoTypeDefinition({genericType: {type: genericType}});
    }
}

export function castTableDataInfoTypeDefinitionToClassDefinition(definition: TableDataInfoTypeDefinition) {
    const tableDataInfoClassDefinition = new ClassDefinition( `${config.projectPackage}.core.page` ,'TableDataInfo');
    if (definition.genericTypes)
    {
        definition.genericTypes.forEach(genericType => {
            tableDataInfoClassDefinition.addGenericType(DTOGenerator.castToClassDefinition(genericType.type as ObjectTypeDefinition));
        });
    }
    return tableDataInfoClassDefinition;
}