import {MethodDefinition} from "./MethodDefinition";
import {AnnotationDefinition} from "./AnnotationDefinition";
import {JavaTypeDefinition} from "./JavaTypeDefinition";

/**
 * 接口定义
 */
export class InterfaceDefinition implements JavaTypeDefinition{

    /**
     * 包名
     */
    packageName: string;

    /**
     * 接口名
     */
    typeName: string;

    /**
     * 方法数组
     */
    methods: MethodDefinition[] = [];

    /**
     * 注解数组
     */
    annotations: AnnotationDefinition[] = [];

    /**
     * 基接口
     */
    baseInterfaces?: InterfaceDefinition[] = undefined;

    /**
     * 需要导入的类
     */
    imports: Set<string> = new Set<string>();

    /**
     * 注释
     */
    comment?: string;

    /**
     * 泛型类型
     */
    genericTypes?: JavaTypeDefinition[] = undefined;

    constructor(packageName: string, interfaceName: string, methods: MethodDefinition[] = [], annotations: AnnotationDefinition[] = [], comment?: string, genericTypes?: JavaTypeDefinition[]) {
        this.packageName = packageName;
        this.typeName = interfaceName;
        this.methods = methods;
        this.annotations = annotations;
        this.comment = comment;
        this.genericTypes = genericTypes;
    }

    /**
     * 添加方法
     * @param method
     */
    addMethod(method: MethodDefinition) {
        this.methods.push(method);
    }

    /**
     * 添加注解
     * @param annotation
     */
    addAnnotation(annotation: AnnotationDefinition) {
        this.annotations.push(annotation);
    }

    /**
     * 添加基接口
     * @param baseInterface
     */
    addBaseInterface(baseInterface: InterfaceDefinition) {
        if (!this.baseInterfaces) {
            this.baseInterfaces = [];
        }
        this.baseInterfaces.push(baseInterface);
    }

    /**
     * 添加需要导入的类
     * @param importName
     */
    addImport(importName: string) {
        this.imports.add(importName);
    }

    /**
     * 添加泛型类型
     * @param genericType
     */
    addGenericType(genericType: JavaTypeDefinition) {
        if (!this.genericTypes) {
            this.genericTypes = [];
        }
        this.genericTypes.push(genericType);
    }
}