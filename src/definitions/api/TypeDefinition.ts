import { JavaType } from './JavaType';
interface ITypeDefinition {
    type: JavaType;
    genericTypes?: ITypeDefinition[];

}

export class TypeDefinition implements ITypeDefinition {
    type!: JavaType;
    genericTypes?: ITypeDefinition[];


    constructor(props: ITypeDefinition) {
        Object.assign(this, props);
    }

}