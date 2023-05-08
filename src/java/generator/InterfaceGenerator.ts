import {InterfaceDefinition} from "../definition/InterfaceDefinition";
import {JavaGeneratorUtils} from "./utils/JavaGeneratorUtils";
import {MethodDefinition} from "../definition/MethodDefinition";

export class InterfaceGenerator {
    static generate(interfaceDefinition: InterfaceDefinition) {
        let text = '';

        text += `package ${interfaceDefinition.packageName};\n\n`;

        InterfaceGenerator.buildImports(interfaceDefinition);

        interfaceDefinition.imports.forEach(importName => {
            text += `import ${importName};\n`;
        });

        text += '\n';

        text += JavaGeneratorUtils.generateTypeComment(interfaceDefinition);

        interfaceDefinition.annotations.forEach(annotation => {
            text += JavaGeneratorUtils.generateAnnotation(annotation) + '\n';
        })
        text += `public interface ${interfaceDefinition.typeName}`;
        if (interfaceDefinition.baseInterfaces && interfaceDefinition.baseInterfaces.length > 0) {
            text += ' extends ';
            text += interfaceDefinition.baseInterfaces.map(baseInterface => {
                return JavaGeneratorUtils.generateType(baseInterface);
            }).join(',');
        }

        text += ' {\n\n';

        interfaceDefinition.methods.forEach(method => {
            text += InterfaceGenerator.generateMethod(method);
        });

        text += '}';

        return text;
    }

    private static buildImports(interfaceDefinition: InterfaceDefinition) {

        InterfaceGenerator.buildBaseInterfaceImports(interfaceDefinition);

        InterfaceGenerator.buildAnnotationImports(interfaceDefinition);

        InterfaceGenerator.buildMethodImports(interfaceDefinition);
    }

    private static buildBaseInterfaceImports(interfaceDefinition: InterfaceDefinition) {
        if (interfaceDefinition.baseInterfaces && interfaceDefinition.baseInterfaces.length > 0) {
            interfaceDefinition.baseInterfaces.forEach(baseInterface => {
                interfaceDefinition.addImport(baseInterface.packageName + '.' + baseInterface.typeName);
            });
        }
    }

    private static buildAnnotationImports(interfaceDefinition: InterfaceDefinition) {
        interfaceDefinition.annotations.forEach(annotation => {
            interfaceDefinition.addImport(annotation.packageName + '.' + annotation.annotationName);
        });
    }

    private static buildMethodImports(interfaceDefinition: InterfaceDefinition) {
        interfaceDefinition.methods.forEach(method => {
            const importByType = JavaGeneratorUtils.buildImportByType(method.returnType);
            if (importByType)
                interfaceDefinition.addImport(importByType);

            method.annotations.forEach(annotation => {
                interfaceDefinition.addImport(annotation.packageName + '.' + annotation.annotationName);
            })

            method.parameters.forEach(parameter => {
                const importByType = JavaGeneratorUtils.buildImportByType(parameter.type);
                if (importByType)
                    interfaceDefinition.addImport(importByType);

                parameter.annotations.forEach(annotation => {
                    interfaceDefinition.addImport(annotation.packageName + '.' + annotation.annotationName);
                })
            });
        });
    }

    private static generateMethod(method: MethodDefinition) {
        let text = '';

        text += JavaGeneratorUtils.generateMethodComment(method);

        method.annotations.forEach(annotation => {
            text += `\t${JavaGeneratorUtils.generateAnnotation(annotation)}\n`;
        });

        text += `\t ${JavaGeneratorUtils.generateType(method.returnType)} ${method.name}(${method.parameters.map((param) => {
            return `${param.annotations.map(annotation => JavaGeneratorUtils.generateAnnotation(annotation) + ' ').join()}${JavaGeneratorUtils.generateType(param.type)} ${param.name}`;
        }).join(',')}) ;\n\n`;

        return text;
    }
}