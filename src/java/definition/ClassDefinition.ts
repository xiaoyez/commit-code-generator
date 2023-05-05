import {TypeDefinition} from "../../dto/definition/TypeDefinition";
import {FieldDefinition} from "./FieldDefinition";
import {MethodDefinition} from "./MethodDefinition";
import {AnnotationDefinition} from "./AnnotationDefinition";

export class ClassDefinition {
    baseClass?: ClassDefinition | TypeDefinition;

    imports: Set<string> = new Set<string>();

    packageName: string;

    className: string;

    comment?: string;

    fields: FieldDefinition[] = [];

    methods: MethodDefinition[] = [];

    annotations: AnnotationDefinition[] = [];

    constructor(packageName: string, className: string, comment?: string, fields: FieldDefinition[] = [], methods: MethodDefinition[] = [], annotations: AnnotationDefinition[] = [], baseClass?: ClassDefinition | TypeDefinition) {
        this.packageName = packageName;
        this.className = className;
        this.comment = comment;
        this.fields = fields;
        this.methods = methods;
        this.annotations = annotations;
        this.baseClass = baseClass;
    }

    addImport(importName: string) {
        this.imports.add(importName);
    }
}