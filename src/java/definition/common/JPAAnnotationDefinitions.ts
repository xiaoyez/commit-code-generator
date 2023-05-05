import {AnnotationDefinition} from "../AnnotationDefinition";

export const JPAAnnotationDefinitions = {
    Entity: new AnnotationDefinition('javax.persistence','Entity'),
    Table: new AnnotationDefinition('javax.persistence','Table'),
    Id: new AnnotationDefinition('javax.persistence','Id'),
    Column: new AnnotationDefinition('javax.persistence','Column'),
    GeneratedValue: new AnnotationDefinition('javax.persistence','GeneratedValue', [{name: 'strategy', value: 'GenerationType.IDENTITY'}]),
}