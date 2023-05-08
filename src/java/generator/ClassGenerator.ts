import {ClassDefinition} from "../definition/ClassDefinition";
import {ObjectTypeDefinition, TypeDefinition} from "../../dto/definition/TypeDefinition";
import {FieldDefinition} from "../definition/FieldDefinition";
import {MethodDefinition} from "../definition/MethodDefinition";
import {AnnotationDefinition} from "../definition/AnnotationDefinition";
import {JavaGeneratorUtils} from "./utils/JavaGeneratorUtils";

export class ClassGenerator {
    static generate(classDefinition: ClassDefinition) : string{
        let text = '';

        text += `package ${classDefinition.packageName};\n\n`;

        ClassGenerator.buildImports(classDefinition);

        classDefinition.imports.forEach(importName => {
            text += `import ${importName};\n`;
        });

        text += '\n';

        text += JavaGeneratorUtils.generateTypeComment(classDefinition);

        classDefinition.annotations.forEach(annotation => {
            text += JavaGeneratorUtils.generateAnnotation(annotation) + '\n';
        })
        text += `public class ${classDefinition.typeName}`;
        if (classDefinition.baseClass) {
            text += ` extends ${JavaGeneratorUtils.generateType(classDefinition.baseClass)}`;
        }
        if (classDefinition.baseInterfaces && classDefinition.baseInterfaces.length > 0) {
            text += ' implements ';
            text += classDefinition.baseInterfaces.map(baseInterface => {
                return baseInterface.typeName;
            }).join(',');
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

    private static buildImports(classDefinition: ClassDefinition) {
        ClassGenerator.buildBaseClassImport(classDefinition);

        ClassGenerator.buildBaseInterfaceImports(classDefinition);

        ClassGenerator.buildAnnotationImports(classDefinition);

        ClassGenerator.buildFieldImports(classDefinition);

        JavaGeneratorUtils.buildMethodImports(classDefinition);
    }


    private static buildFieldImports(classDefinition: ClassDefinition) {
        classDefinition.fields.forEach(field => {
            const importByType = JavaGeneratorUtils.buildImportByType(field.type);
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
            const importByType = JavaGeneratorUtils.buildImportByType(classDefinition.baseClass);
            if (importByType)
                classDefinition.addImport(importByType);
        }
    }





    private static generateField(field: FieldDefinition) {

        let text = '';

        text += ClassGenerator.generateFieldComment(field);

        field.annotations.forEach(annotation => {
            text += `\t${JavaGeneratorUtils.generateAnnotation(annotation)}\n`;
        });

        text += `\t${field.modifier} ${JavaGeneratorUtils.generateType(field.type)} ${field.name};\n\n`;

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

        text += JavaGeneratorUtils.generateMethodComment(method);

        method.annotations.forEach(annotation => {
            text += `\t${JavaGeneratorUtils.generateAnnotation(annotation)}\n`;
        });

        text += `\t${method.modifier} ${JavaGeneratorUtils.generateType(method.returnType)} ${method.name}(${method.parameters.map((param) => {
            return `${param.annotations.map(annotation => JavaGeneratorUtils.generateAnnotation(annotation) + ' ').join()}${JavaGeneratorUtils.generateType(param.type)} ${param.name}`;
        }).join(',')}) {\n`;

        text += `\t\t//TODO: implement\n`;
        text += `\t\treturn null;\n`;
        text += `\t}\n\n`;

        return text;
    }



    private static buildBaseInterfaceImports(classDefinition: ClassDefinition) {
        if (classDefinition.baseInterfaces && classDefinition.baseInterfaces.length > 0) {
            classDefinition.baseInterfaces.forEach(baseInterface => {
                classDefinition.addImport(baseInterface.packageName + '.' + baseInterface.typeName);
            });
        }
    }
}