import {TypeDefinition} from "../../dto/definition/TypeDefinition";
import {FieldDefinition} from "./FieldDefinition";
import {MethodDefinition} from "./MethodDefinition";
import {AnnotationDefinition} from "./AnnotationDefinition";
import {InterfaceDefinition} from "./InterfaceDefinition";
import {JavaTypeDefinition} from "./JavaTypeDefinition";

/**
 * 类定义
 */
export class ClassDefinition implements JavaTypeDefinition {

    /**
     * 基类
     */
    baseClass?: ClassDefinition | TypeDefinition;

    /**
     * 基接口
     */
    baseInterfaces?: InterfaceDefinition[] = undefined;

    /**
     * 泛型类型
     */
    genericTypes?: JavaTypeDefinition[] = undefined;

    /**
     * 需要导入的类
     */
    imports: Set<string> = new Set<string>();

    /**
     * 包名
     */
    packageName: string;

    /**
     * 类名
     */
    typeName: string;

    /**
     * 注释
     */
    comment?: string;

    /**
     * 字段数组
     */
    fields: FieldDefinition[] = [];

    /**
     * 方法数组
     */
    methods: MethodDefinition[] = [];

    /**
     * 注解数组
     */
    annotations: AnnotationDefinition[] = [];

    constructor(packageName: string, className: string, comment?: string, fields: FieldDefinition[] = [], methods: MethodDefinition[] = [], annotations: AnnotationDefinition[] = [], baseClass?: ClassDefinition | TypeDefinition, genericTypes?: JavaTypeDefinition[]) {
        this.packageName = packageName;
        this.typeName = className;
        this.comment = comment;
        this.fields = fields;
        this.methods = methods;
        this.annotations = annotations;
        this.baseClass = baseClass;
        this.genericTypes = genericTypes;
    }

    /**
     * 添加需要导入的类
     * @param importName
     */
    addImport(importName: string) {
        this.imports.add(importName);
    }

    /**
     * 添加字段
     * @param field
     */
    addField(field: FieldDefinition) {
        this.fields.push(field);
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
     * 添加方法
     * @param method
     */
    addMethod(method: MethodDefinition): void {
        this.methods.push(method);
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