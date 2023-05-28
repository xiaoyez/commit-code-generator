import {AnnotationDefinition} from "./AnnotationDefinition";
import {TypeDefinition} from "../../dto/definition/TypeDefinition";
import {ClassDefinition} from "./ClassDefinition";

/**
 * 方法参数定义
 */
export class ParameterDefinition {

    /**
     * 参数名称
     */
    name: string;

    /**
     * 参数类型
     */
    type: TypeDefinition|ClassDefinition;

    /**
     * 注释
     */
    comment?: string;

    /**
     * 注解数组
     */
    annotations: AnnotationDefinition[] = [];
    constructor(name: string, type: TypeDefinition|ClassDefinition, comment?: string, annotations: AnnotationDefinition[] = []) {
        this.name = name;
        this.type = type;
        this.comment = comment;
        this.annotations = annotations;
    }

    /**
     * 添加注解
     * @param annotation
     */
    addAnnotation(annotation: AnnotationDefinition) {
        this.annotations.push(annotation);
    }
}