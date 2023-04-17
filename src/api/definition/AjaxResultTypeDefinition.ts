import {ITypeDefinition, ObjectTypeDefinition, TypeDefinition} from "../../dto/definition/TypeDefinition";
import {config} from "../../config/Config";
import {JavaType} from "../../dto/definition/JavaType";

const ajaxResult = new ObjectTypeDefinition({
    className: "AjaxResult",
    packageName: `${config.projectPackage}.core.domain`,
    properties: []
})

interface IAjaxResultTypeDefinition {
    genericType?: ITypeDefinition;
}

export class AjaxResultTypeDefinition extends TypeDefinition {
    constructor(props: IAjaxResultTypeDefinition) {
        super({type: ajaxResult, genericTypes: props.genericType ? [props.genericType] : undefined});
    }

    static createAjax(genericType?: JavaType|ObjectTypeDefinition) {
        return new AjaxResultTypeDefinition({genericType: genericType?{type: genericType}: undefined});
    }
}