import {ClassDefinition} from "../definition/ClassDefinition";
import {ObjectTypeDefinition, TypeDefinition} from "../../dto/definition/TypeDefinition";
import {JavaType} from "../../dto/definition/JavaType";
import {FieldDefinition} from "../definition/FieldDefinition";
import {MethodDefinition} from "../definition/MethodDefinition";
import {AnnotationDefinition} from "../definition/AnnotationDefinition";

export class ClassGenerator {
    static generate(classDefinition: ClassDefinition) : string{
        let text = '';

        text += `package ${classDefinition.packageName};\n\n`;

        ClassGenerator.buildImports(classDefinition);

        classDefinition.imports.forEach(importName => {
            text += `import ${importName};\n`;
        });

        text += '\n';

        text = ClassGenerator.generateClassComment(classDefinition, text);

        classDefinition.annotations.forEach(annotation => {
            text += ClassGenerator.generateAnnotation(annotation) + '\n';
        })
        text += `public class ${classDefinition.className}`;
        if (classDefinition.baseClass) {
            text += ` extends ${ClassGenerator.generateType(classDefinition.baseClass)}`;
        }

        text += ' {\n\n';

        classDefinition.fields.forEach(field => {
            text += ClassGenerator.generateField(field);
        });

        classDefinition.methods.forEach(method => {
            text += ClassGenerator.generateMethod(method);
        });

        text += '}';

        return text;
    }

    private static generateClassComment(classDefinition: ClassDefinition, text: string) {
        if (classDefinition.comment) {
            text += `/**\n * ${classDefinition.comment}\n*/\n`;
        }
        return text;
    }

    private static buildImports(classDefinition: ClassDefinition) {
        ClassGenerator.buildBaseClassImport(classDefinition);

        ClassGenerator.buildAnnotationImports(classDefinition);

        ClassGenerator.buildFieldImports(classDefinition);

        ClassGenerator.buildMethodImports(classDefinition);
    }

    private static buildMethodImports(classDefinition: ClassDefinition) {
        classDefinition.methods.forEach(method => {
            const importByType = ClassGenerator.buildImportByType(method.returnType);
            if (importByType)
                classDefinition.addImport(importByType);

            method.annotations.forEach(annotation => {
                classDefinition.addImport(annotation.packageName + '.' + annotation.annotationName);
            })

            method.parameters.forEach(parameter => {
                const importByType = ClassGenerator.buildImportByType(parameter.type);
                if (importByType)
                    classDefinition.addImport(importByType);

                parameter.annotations.forEach(annotation => {
                    classDefinition.addImport(annotation.packageName + '.' + annotation.annotationName);
                })
            });
        });
    }

    private static buildFieldImports(classDefinition: ClassDefinition) {
        classDefinition.fields.forEach(field => {
            const importByType = ClassGenerator.buildImportByType(field.type);
            if (importByType)
                classDefinition.addImport(importByType);
        });
    }

    private static buildAnnotationImports(classDefinition: ClassDefinition) {
        classDefinition.annotations.forEach(annotation => {
            classDefinition.addImport(annotation.packageName + '.' + annotation.annotationName);
        });
    }

    private static buildBaseClassImport(classDefinition: ClassDefinition) {
        if (classDefinition.baseClass) {
            const importByType = ClassGenerator.buildImportByType(classDefinition.baseClass);
            if (importByType)
                classDefinition.addImport(importByType);
        }
    }

    private static buildImportByType(type: TypeDefinition|ClassDefinition) {
        if (type instanceof ClassDefinition) {
            return `${type.packageName}.${type.className}`;
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

    private static generateType(type: ClassDefinition | TypeDefinition) {
        if (type instanceof ClassDefinition) {
            return type.className;
        }
        else
        {
            const typeType = type.type;
            if (typeType instanceof ObjectTypeDefinition) {
                return typeType.className;
            } else
                return typeType;
        }
    }

    private static generateField(field: FieldDefinition) {

        let text = '';

        text += ClassGenerator.generateFieldComment(field);

        field.annotations.forEach(annotation => {
            text += `\t${ClassGenerator.generateAnnotation(annotation)}\n`;
        });

        text += `\t ${field.modifier} ${ClassGenerator.generateType(field.type)} ${field.name};\n\n`;

        return text;
    }

    private static generateFieldComment(field: FieldDefinition) {
        if (field.comment) {
            return `\t/** ${field.comment} */\n`;
        }
        return "";
    }

    private static generateMethod(method: MethodDefinition) {

        let text = '';

        text += ClassGenerator.generateMethodComment(method);

        method.annotations.forEach(annotation => {
            text += `\t${ClassGenerator.generateAnnotation(annotation)}\n`;
        });

        text += `\t ${method.modifier} ${ClassGenerator.generateType(method.returnType)} ${method.name}(${method.parameters.map((param) => {
            return `${param.annotations.map(annotation => ClassGenerator.generateAnnotation(annotation) + ' ').join()}${ClassGenerator.generateType(param.type)} ${param.name}`;
        }).join(',')}) {\n`;

        text += `\t\t//TODO: implement\n`;
        text += `\t\treturn null;\n`;
        text += `\t}\n\n`;

        return text;
    }

    private static generateMethodComment(method: MethodDefinition) {
        if (method.comment) {
            return `\t/**\n \t * ${method.comment}\n ${method.parameters.map((param) => {
                return `\t * @param ${param.name} ${param.comment}\n`;
            }).join('')} */\n`;
        }
        return "";
    }

    private static generateAnnotation(annotation: AnnotationDefinition) {
        let text = '';
        text += `@${annotation.annotationName}`;
        if (annotation.properties.length > 0) {
            text += `(${annotation.properties.map((property) => {
                return `${property.name} = ${property.value}`;
            }).join(',')})`;
        }
        return text;
    }
}