import {MethodDefinition} from "./MethodDefinition";
import {AnnotationDefinition} from "./AnnotationDefinition";
import {JavaTypeDefinition} from "./JavaTypeDefinition";
import {TypeDefinition} from "../../dto/definition/TypeDefinition";

export class InterfaceDefinition implements JavaTypeDefinition{
    packageName: string;
    typeName: string;
    methods: MethodDefinition[] = [];

    annotations: AnnotationDefinition[] = [];

    baseInterfaces?: InterfaceDefinition[] = undefined;

    imports: Set<string> = new Set<string>();

    comment?: string;

    genericTypes?: JavaTypeDefinition[] = undefined;

    constructor(packageName: string, interfaceName: string, methods: MethodDefinition[] = [], annotations: AnnotationDefinition[] = [], comment?: string, genericTypes?: JavaTypeDefinition[]) {
        this.packageName = packageName;
        this.typeName = interfaceName;
        this.methods = methods;
        this.annotations = annotations;
        this.comment = comment;
        this.genericTypes = genericTypes;
    }

    addMethod(method: MethodDefinition) {
        this.methods.push(method);
    }

    addAnnotation(annotation: AnnotationDefinition) {
        this.annotations.push(annotation);
    }

    addBaseInterface(baseInterface: InterfaceDefinition) {
        if (!this.baseInterfaces) {
            this.baseInterfaces = [];
        }
        this.baseInterfaces.push(baseInterface);
    }

    addImport(importName: string) {
        this.imports.add(importName);
    }

    addGenericType(genericType: JavaTypeDefinition) {
        if (!this.genericTypes) {
            this.genericTypes = [];
        }
        this.genericTypes.push(genericType);
    }
}