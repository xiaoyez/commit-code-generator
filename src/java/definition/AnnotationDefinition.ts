export class AnnotationDefinition {
    packageName: string;
    annotationName: string;
    properties: AnnotationPropertyDefinition[] = [];

    constructor(packageName: string, annotationName: string, properties: AnnotationPropertyDefinition[] = []) {
        this.packageName = packageName;
        this.annotationName = annotationName;
        this.properties = properties;
    }

    addProperty(name: string, value: string) {
        this.properties.push({name, value});
    }

}

export interface AnnotationPropertyDefinition {
    name: string;
    value: string;
}