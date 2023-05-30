import {InterfaceDefinition} from "../definition/InterfaceDefinition";
import {JavaGeneratorUtils} from "./utils/JavaGeneratorUtils";
import {MethodDefinition} from "../definition/MethodDefinition";
import {compileEjsTmp} from "../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../ejsTmp/EjsTmp";

export class InterfaceGenerator {

    /**
     * 生成接口内容
     * @param interfaceDefinition
     */
    static generate(interfaceDefinition: InterfaceDefinition) {

        InterfaceGenerator.buildImports(interfaceDefinition);


        return compileEjsTmp(ejsTmp.javaInterfaceTmp, interfaceDefinition);
    }

    /**
     * 生成接口的导入
     * @param interfaceDefinition
     * @private
     */
    private static buildImports(interfaceDefinition: InterfaceDefinition) {

        InterfaceGenerator.buildBaseInterfaceImports(interfaceDefinition);

        InterfaceGenerator.buildAnnotationImports(interfaceDefinition);

        InterfaceGenerator.buildMethodImports(interfaceDefinition);
    }

    /**
     * 构建基础接口的导入
     * @param interfaceDefinition
     * @private
     */
    private static buildBaseInterfaceImports(interfaceDefinition: InterfaceDefinition) {
        if (interfaceDefinition.baseInterfaces && interfaceDefinition.baseInterfaces.length > 0) {
            interfaceDefinition.baseInterfaces.forEach(baseInterface => {
                interfaceDefinition.addImport(baseInterface.packageName + '.' + baseInterface.typeName);
                if (baseInterface.genericTypes && baseInterface.genericTypes.length > 0) {
                    baseInterface.genericTypes.forEach(genericType => {
                        interfaceDefinition.addImport(genericType.packageName + '.' + genericType.typeName);
                    });
                }
            });
        }
    }

    /**
     * 构建注解的导入
     * @param interfaceDefinition
     * @private
     */
    private static buildAnnotationImports(interfaceDefinition: InterfaceDefinition) {
        interfaceDefinition.annotations.forEach(annotation => {
            interfaceDefinition.addImport(annotation.packageName + '.' + annotation.annotationName);
        });
    }

    /**
     * 构建方法的导入
     * @param interfaceDefinition
     * @private
     */
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