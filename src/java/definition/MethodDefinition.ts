import {AnnotationDefinition} from "./AnnotationDefinition";
import {ParameterDefinition} from "./ParameterDefinition";
import {Modifier} from "./Modifier";
import {TypeDefinition} from "../../dto/definition/TypeDefinition";
import {ClassDefinition} from "./ClassDefinition";

export class MethodDefinition {

    modifier: Modifier;
    name: string;
    returnType: TypeDefinition|ClassDefinition;
    comment?: string;
    annotations: AnnotationDefinition[] = [];
    parameters: ParameterDefinition[] = [];

    constructor(name: string, returnType: TypeDefinition, comment?: string, modifier: Modifier = Modifier.PUBLIC, parameters: ParameterDefinition[] = [], annotations: AnnotationDefinition[] = []) {
        this.name = name;
        this.returnType = returnType;
        this.comment = comment;
        this.modifier = modifier;
        this.parameters = parameters;
        this.annotations = annotations;
    }

}