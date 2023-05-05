import {AnnotationDefinition} from "./AnnotationDefinition";
import {Modifier} from "./Modifier";
import {TypeDefinition} from "../../dto/definition/TypeDefinition";
import {ClassDefinition} from "./ClassDefinition";


export class FieldDefinition {
    modifier: Modifier;
    name: string;
    type: TypeDefinition|ClassDefinition;
    comment?: string;
    annotations: AnnotationDefinition[] = [];
    constructor(name: string, type: TypeDefinition|ClassDefinition, comment?: string, modifier: Modifier = Modifier.PRIVATE) {
        this.name = name;
        this.type = type;
        this.comment = comment;
        this.modifier = modifier;
    }
    addAnnotation(annotation: AnnotationDefinition) {
        this.annotations.push(annotation);
    }
}