import { JavaType } from './JavaType';
import { ObjectTypeDefinition } from './ObjectTypeDefinition';
interface ITypeDefinition {
    type: JavaType|ObjectTypeDefinition;
    genericTypes?: ITypeDefinition[];

}

export class TypeDefinition implements ITypeDefinition {
    type!: JavaType|ObjectTypeDefinition;
    genericTypes?: ITypeDefinition[];


    constructor(props: ITypeDefinition) {
        Object.assign(this, props);
    }

}

type N = {
    aaa: number;
    bbb: string;
}

type K<T,L> = {
    data: T;
    base222: L;
}

type Use = K<N, N>;