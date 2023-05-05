import {AnnotationDefinition} from "./AnnotationDefinition";
import {TypeDefinition} from "../../dto/definition/TypeDefinition";
import {ClassDefinition} from "./ClassDefinition";

export class ParameterDefinition {
    name: string;
    type: TypeDefinition|ClassDefinition;
    comment?: string;
    annotations: AnnotationDefinition[] = [];
    constructor(name: string, type: TypeDefinition|ClassDefinition, comment?: string, annotations: AnnotationDefinition[] = []) {
        this.name = name;
        this.type = type;
        this.comment = comment;
        this.annotations = annotations;
    }
}