import {MethodDefinition} from "./MethodDefinition";
import {AnnotationDefinition} from "./AnnotationDefinition";

/**
 * Java类型定义
 */
export interface JavaTypeDefinition {

    /**
     * 需要导入的类
     */
    imports: Set<string>;

    /**
     * 方法数组
     */
    methods: MethodDefinition[];

    /**
     * 注解数组
     */
    annotations: AnnotationDefinition[];

    /**
     * 注释
     */
    comment?: string;

    /**
     * 泛型类型
     */
    genericTypes?: JavaTypeDefinition[] ;

    /**
     * 类型名
     */
    typeName: string;

    /**
     * 包名
     */
    packageName: string;

    /**
     * 添加需要导入的类
     * @param importName
     */
    addImport(importName: string):void;

    /**
     * 添加注解
     * @param annotation
     */
    addAnnotation(annotation: AnnotationDefinition):void;

    /**
     * 添加方法
     * @param method
     */
    addMethod(method: MethodDefinition):void;

    /**
     * 添加泛型类型
     * @param genericType
     */
    addGenericType(genericType: JavaTypeDefinition):void;
}