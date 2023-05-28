import {ObjectTypeDefinition, TypeDefinition} from "../../../dto/definition/TypeDefinition";
import {ClassDefinition} from "../../definition/ClassDefinition";
import {JavaType} from "../../../dto/definition/JavaType";
import {JavaTypeDefinition} from "../../definition/JavaTypeDefinition";
import {AnnotationDefinition} from "../../definition/AnnotationDefinition";
import {MethodDefinition} from "../../definition/MethodDefinition";
import {ModuleUtils} from "../../../api/utils/ModuleUtils";

export class JavaGeneratorUtils {

    /**
     * 构建import
     * @param type
     */
    static buildImportByType(type: TypeDefinition|JavaTypeDefinition) {
        if (JavaGeneratorUtils.isJavaTypeDefinition(type)) {
            return `${type.packageName}.${type.typeName}`;
        }
        else
        {
            const typeType = type.type;
            if (typeType instanceof ObjectTypeDefinition) {
                return `${typeType.packageName}.${typeType.className}`;
            } else if (typeType === JavaType.Date) {
                return 'java.util.Date';
            }
        }
    }

    /**
     * 构建方法的import
     * @param definition
     */
    static buildMethodImports(definition: JavaTypeDefinition) {
        definition.methods.forEach(method => {
            const importByType = JavaGeneratorUtils.buildImportByType(method.returnType);
            if (importByType)
                definition.addImport(importByType);

            method.annotations.forEach(annotation => {
                definition.addImport(annotation.packageName + '.' + annotation.annotationName);
            })

            method.parameters.forEach(parameter => {
                const importByType = JavaGeneratorUtils.buildImportByType(parameter.type);
                if (importByType)
                    definition.addImport(importByType);

                parameter.annotations.forEach(annotation => {
                    definition.addImport(annotation.packageName + '.' + annotation.annotationName);
                })
            });
        });
    }

    /**
     * 生成类型注释
     * @param definition
     */
    static generateTypeComment(definition: JavaTypeDefinition) {
        if (definition.comment) {
            return `/**\n * ${definition.comment}\n*/\n`;
        }
        return "";
    }

    /**
     * 生成注解
     * @param annotation
     */
    static generateAnnotation(annotation: AnnotationDefinition) {
        let text = '';
        text += `@${annotation.annotationName}`;
        if (annotation.properties.length > 0) {
            text += `(${annotation.properties.map((property) => {
                return `${property.name} = "${property.value}"`;
            }).join(',')})`;
        }
        return text;
    }

    /**
     * 生成方法注释
     * @param method
     */
    static generateMethodComment(method: MethodDefinition) {
        if (method.comment) {
            return `\t/**\n \t * ${method.comment}\n ${method.parameters.map((param) => {
                return `\t * @param ${param.name} ${param.comment?param.comment:''}\n`;
            }).join('')}\t */\n`;
        }
        return "";
    }

    /**
     * 是否是JavaTypeDefinition
     * @param type
     * @private
     */
    private static isJavaTypeDefinition(type: JavaTypeDefinition | TypeDefinition) : type is JavaTypeDefinition {
        return (type as JavaTypeDefinition).typeName !== undefined;
    }

    /**
     * 生成类型字符串
     * @param type
     */
    static generateType(type: JavaTypeDefinition | TypeDefinition) {
        if (JavaGeneratorUtils.isJavaTypeDefinition(type)) {
            return type.typeName + JavaGeneratorUtils.generateGenericTypes(type.genericTypes);
        }
        else
        {
            const typeType = type.type;
            if (typeType instanceof ObjectTypeDefinition) {
                return typeType.className + ModuleUtils.buildGenericTypeText(type);
            } else
                return typeType;
        }
    }

    /**
     * 生成泛型字符串
     * @param genericTypes
     */
    static generateGenericTypes(genericTypes: JavaTypeDefinition[] | undefined) {
        if (genericTypes && genericTypes.length > 0) {
            return `<${genericTypes.map((type) => {
                return type.typeName;
            }).join(',')}>`;
        }
        return "";
    }
}