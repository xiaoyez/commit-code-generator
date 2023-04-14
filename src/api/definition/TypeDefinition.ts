import {JavaType} from "./JavaType";


export interface IPropertyDefinition {
    /**
     * 参数名称。
     */
    paramName: string;

    /**
     * 参数类型。
     */
    paramType: TypeDefinition;

    /**
     * 参数描述。
     */
    paramDesc?: string;
}

interface IObjectTypeDefinition {

    properties: IPropertyDefinition[];

    className: string;

    packageName: string;
}

export class ObjectTypeDefinition implements IObjectTypeDefinition {
    properties!: IPropertyDefinition[];
    className!: string;
    packageName!: string;

    constructor(props: IObjectTypeDefinition) {
        Object.assign(this, props);
    }
}

interface ITypeDefinition {
    type: JavaType|ObjectTypeDefinition;
    genericTypes?: ITypeDefinition[];

}

export class TypeDefinition implements ITypeDefinition {
    type!: JavaType|ObjectTypeDefinition;
    genericTypes?: TypeDefinition[];

    constructor(props: ITypeDefinition) {
        Object.assign(this, props);
        if (props.genericTypes) {
            this.genericTypes = props.genericTypes.map(def => {
                if (def instanceof TypeDefinition) {
                    return def;
                }
                else {
                    return new TypeDefinition(def);
                }
            });
        }
    }

}