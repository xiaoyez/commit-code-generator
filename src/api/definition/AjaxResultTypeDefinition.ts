import {ITypeDefinition, ObjectTypeDefinition, TypeDefinition} from "../../dto/definition/TypeDefinition";
import {config} from "../../config/Config";
import {JavaType} from "../../dto/definition/JavaType";
import {ClassDefinition} from "../../java/definition/ClassDefinition";
import {DTOGenerator} from "../../dto/generator/DTOGenerator";

// AjaxResult
const ajaxResult = new ObjectTypeDefinition({
    className: "AjaxResult",
    packageName: `${config.projectPackage}.core.domain`,
    properties: []
})

/**
 * AjaxResult类型定义
 */
interface IAjaxResultTypeDefinition {
    genericType?: ITypeDefinition;
}

/**
 * AjaxResult类型定义
 */
export class AjaxResultTypeDefinition extends TypeDefinition {
    constructor(props: IAjaxResultTypeDefinition) {
        super({type: ajaxResult, genericTypes: props.genericType ? [props.genericType] : undefined});
    }

    /**
     * 创建AjaxResult类型定义
     * @param genericType
     */
    static createAjax(genericType?: JavaType|ObjectTypeDefinition) {
        return new AjaxResultTypeDefinition({genericType: genericType?{type: genericType}: undefined});
    }
}

export function castAjaxResultTypeDefinitionToClassDefinition(definition: AjaxResultTypeDefinition) {
    const ajaxResultClassDefinition = new ClassDefinition( `${config.projectPackage}.core.domain` ,'AjaxResult');
    if (definition.genericTypes)
    {
        definition.genericTypes.forEach(genericType => {
            ajaxResultClassDefinition.addGenericType(DTOGenerator.castToClassDefinition(genericType.type as ObjectTypeDefinition));
        });
    }
    return ajaxResultClassDefinition;
}