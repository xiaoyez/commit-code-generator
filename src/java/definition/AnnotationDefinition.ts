/**
 * 注解定义
 */
export class AnnotationDefinition {
    /**
     * 包名
     */
    packageName: string;

    /**
     * 注解名
     */
    annotationName: string;

    /**
     * 属性数组
     */
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

/**
 * 注解属性定义
 */
export interface AnnotationPropertyDefinition {
    /**
     * 属性名
     */
    name: string;
    /**
     * 属性值
     */
    value: string;
}