import {AnnotationDefinition} from "../AnnotationDefinition";

export const LombokAnnotationDefinitions = {
    DATA: new AnnotationDefinition('lombok','Data'),
    NO_ARGS_CONSTRUCTOR: new AnnotationDefinition('lombok','NoArgsConstructor'),
    ALL_ARGS_CONSTRUCTOR: new AnnotationDefinition('lombok','AllArgsConstructor'),
    BUILDER: new AnnotationDefinition('lombok','Builder'),
}