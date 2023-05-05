import {TypeDefinition} from "../../dto/definition/TypeDefinition";
import {FieldDefinition} from "./FieldDefinition";
import {MethodDefinition} from "./MethodDefinition";
import {AnnotationDefinition} from "./AnnotationDefinition";
import {InterfaceDefinition} from "./InterfaceDefinition";
import {JavaTypeDefinition} from "./JavaTypeDefinition";

export class ClassDefinition implements JavaTypeDefinition {
    baseClass?: ClassDefinition | TypeDefinition;

    baseInterfaces?: InterfaceDefinition[] = undefined;

    genericTypes?: JavaTypeDefinition[] = undefined;

    imports: Set<string> = new Set<string>();

    packageName: string;

    typeName: string;

    comment?: string;

    fields: FieldDefinition[] = [];

    methods: MethodDefinition[] = [];

    annotations: AnnotationDefinition[] = [];

    constructor(packageName: string, className: string, comment?: string, fields: FieldDefinition[] = [], methods: MethodDefinition[] = [], annotations: AnnotationDefinition[] = [], baseClass?: ClassDefinition | TypeDefinition, genericTypes?: JavaTypeDefinition[]) {
        this.packageName = packageName;
        this.typeName = className;
        this.comment = comment;
        this.fields = fields;
        this.methods = methods;
        this.annotations = annotations;
        this.baseClass = baseClass;
        this.genericTypes = genericTypes;
    }

    addImport(importName: string) {
        this.imports.add(importName);
    }

    addAnnotation(annotation: AnnotationDefinition) {
        this.annotations.push(annotation);
    }

    addInterface(baseInterface: InterfaceDefinition) {
        if (!this.baseInterfaces) {
            this.baseInterfaces = [];
        }
        this.baseInterfaces.push(baseInterface);
    }

    addMethod(method: MethodDefinition): void {
        this.methods.push(method);
    }

    addGenericType(genericType: JavaTypeDefinition) {
        if (!this.genericTypes) {
            this.genericTypes = [];
        }
        this.genericTypes.push(genericType);
    }
}