import {AnnotationDefinition} from "./AnnotationDefinition";
import {Modifier} from "./Modifier";
import {TypeDefinition} from "../../dto/definition/TypeDefinition";
import {JavaTypeDefinition} from "./JavaTypeDefinition";

/**
 * 字段定义
 */
export class FieldDefinition {
    /**
     * 访问权限修饰符
     */
    modifier: Modifier;

    /**
     * 字段名称
     */
    name: string;

    /**
     * 字段类型
     */
    type: TypeDefinition|JavaTypeDefinition;

    /**
     * 注释
     */
    comment?: string;

    /**
     * 注解数组
     */
    annotations: AnnotationDefinition[] = [];
    constructor(name: string, type: TypeDefinition|JavaTypeDefinition, comment?: string, modifier: Modifier = Modifier.PRIVATE) {
        this.name = name;
        this.type = type;
        this.comment = comment;
        this.modifier = modifier;
    }

    /**
     * 添加注解
     * @param annotation
     */
    addAnnotation(annotation: AnnotationDefinition) {
        this.annotations.push(annotation);
    }
}