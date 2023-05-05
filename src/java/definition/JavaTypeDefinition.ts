import {MethodDefinition} from "./MethodDefinition";
import {AnnotationDefinition} from "./AnnotationDefinition";

export interface JavaTypeDefinition {
    imports: Set<string>;

    methods: MethodDefinition[];

    annotations: AnnotationDefinition[];

    comment?: string;

    genericTypes?: JavaTypeDefinition[] ;

    typeName: string;

    packageName: string;

    addImport(importName: string):void;

    addAnnotation(annotation: AnnotationDefinition):void;

    addMethod(method: MethodDefinition):void;

    addGenericType(genericType: JavaTypeDefinition):void;
}