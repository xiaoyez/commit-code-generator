import {ClassDefinition} from "../definition/ClassDefinition";
import {JavaGeneratorUtils} from "./utils/JavaGeneratorUtils";
import {ejsTmp} from "../../ejsTmp/EjsTmp";
import {compileEjsTmp} from "../../ejsTmp/EjsUtils";

export class ClassGenerator {

    /**
     * 生成类内容
     * @param classDefinition
     */
    static generate(classDefinition: ClassDefinition) : string{
        ClassGenerator.buildImports(classDefinition);
        return compileEjsTmp(ejsTmp.javaClassTmp, classDefinition);

    }

    /**
     * 生成类的导入
     * @param classDefinition
     */
    public static buildImports(classDefinition: ClassDefinition) {

        ClassGenerator.buildBaseClassImport(classDefinition);

        ClassGenerator.buildBaseInterfaceImports(classDefinition);

        ClassGenerator.buildAnnotationImports(classDefinition);

        ClassGenerator.buildFieldImports(classDefinition);

        JavaGeneratorUtils.buildMethodImports(classDefinition);
    }


    /**
     * 构建字段类型的导入
     * @param classDefinition
     * @private
     */
    private static buildFieldImports(classDefinition: ClassDefinition) {
        classDefinition.fields.forEach(field => {
            const importByType = JavaGeneratorUtils.buildImportByType(field.type);
            if (importByType)
                classDefinition.addImport(importByType);
        });
    }

    /**
     * 构建注解的导入
     * @param classDefinition
     * @private
     */
    private static buildAnnotationImports(classDefinition: ClassDefinition) {
        classDefinition.annotations.forEach(annotation => {
            classDefinition.addImport(annotation.packageName + '.' + annotation.annotationName);
        });
    }

    /**
     * 构建基类的导入
     * @param classDefinition
     * @private
     */
    private static buildBaseClassImport(classDefinition: ClassDefinition) {
        if (classDefinition.baseClass) {
            const importByType = JavaGeneratorUtils.buildImportByType(classDefinition.baseClass);
            if (importByType)
                classDefinition.addImport(importByType);
        }
    }

    /**
     * 构建基接口的导入
     * @param classDefinition
     * @private
     */
    private static buildBaseInterfaceImports(classDefinition: ClassDefinition) {
        if (classDefinition.baseInterfaces && classDefinition.baseInterfaces.length > 0) {
            classDefinition.baseInterfaces.forEach(baseInterface => {
                classDefinition.addImport(baseInterface.packageName + '.' + baseInterface.typeName);
            });
        }
    }
}