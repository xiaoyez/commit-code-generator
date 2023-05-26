import {InterfaceDefinition} from "../definition/InterfaceDefinition";
import {JavaGeneratorUtils} from "./utils/JavaGeneratorUtils";
import {MethodDefinition} from "../definition/MethodDefinition";
import {compileEjsTmp} from "../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../ejsTmp/EjsTmp";

export class InterfaceGenerator {
    static generate(interfaceDefinition: InterfaceDefinition) {

        InterfaceGenerator.buildImports(interfaceDefinition);


        return compileEjsTmp(ejsTmp.javaInterfaceTmp, interfaceDefinition);
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

}