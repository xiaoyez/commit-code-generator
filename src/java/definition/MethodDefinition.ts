import {AnnotationDefinition} from "./AnnotationDefinition";
import {ParameterDefinition} from "./ParameterDefinition";
import {Modifier} from "./Modifier";
import {TypeDefinition} from "../../dto/definition/TypeDefinition";
import {ClassDefinition} from "./ClassDefinition";

/**
 * 方法定义
 */
export class MethodDefinition {

    /**
     * 访问权限修饰符
     */
    modifier: Modifier;

    /**
     * 方法名称
     */
    name: string;

    /**
     * 返回值类型
     */
    returnType: TypeDefinition|ClassDefinition;

    /**
     * 注释
     */
    comment?: string;

    /**
     * 注解数组
     */
    annotations: AnnotationDefinition[] = [];

    /**
     * 参数数组
     */
    parameters: ParameterDefinition[] = [];

    constructor(name: string, returnType: TypeDefinition|ClassDefinition, comment?: string, modifier: Modifier = Modifier.PUBLIC, parameters: ParameterDefinition[] = [], annotations: AnnotationDefinition[] = []) {
        this.name = name;
        this.returnType = returnType;
        this.comment = comment;
        this.modifier = modifier;
        this.parameters = parameters;
        this.annotations = annotations;
    }

    /**
     * 添加注解
     * @param annotation
     */
    addAnnotation(annotation: AnnotationDefinition) {
        this.annotations.push(annotation);
    }

    /**
     * 添加参数
     * @param parameter
     */
    addParameter(parameter: ParameterDefinition) {
        this.parameters.push(parameter);
    }

}