import {
    DomainTypeDefinition, IDomainPropertyDefinition,
    IPropertyDefinition,
    ObjectTypeDefinition,
    TypeDefinition
} from "../definition/TypeDefinition";
import {JavaType} from "../definition/JavaType";
import {config} from "../../config/Config";
import {isOfType} from "../../utils/TypeUtils";
import {exist, getParent, mkdirs, writeStringToFile} from "../../utils/FileUtils";
import {getDomainPackage, getDtoPackage, getJavaFilePath} from "../../utils/JavaUtils";
import {ClassDefinition} from "../../java/definition/ClassDefinition";
import {LombokAnnotationDefinitions} from "../../java/definition/common/LombokAnnotationDefinitions";
import {FieldDefinition} from "../../java/definition/FieldDefinition";
import {JPAAnnotationDefinitions} from "../../java/definition/common/JPAAnnotationDefinitions";
import {JsonAnnotationDefinitions} from "../../java/definition/common/JsonAnnotationDefinitions";
import {ClassGenerator} from "../../java/generator/ClassGenerator";

export class DTOGenerator {
    /**
     * 生成DTO类。
     * @param definition
     */
    static generate(definition: ObjectTypeDefinition) {

        const dtoClassDefinition = DTOGenerator.castToClassDefinition(definition);

        // 生成.java文件
        DTOGenerator.generateJavaFile(definition, ClassGenerator.generate(dtoClassDefinition));
    }

    /**
     * 将ObjectTypeDefinition转换为ClassDefinition。
     * @param definition
     */
    static castToClassDefinition(definition: ObjectTypeDefinition) {
        const packageName = DTOGenerator.generatePackage(definition);

        const dtoClassDefinition = new ClassDefinition(packageName,definition.className,definition.comment);

        DTOGenerator.addLombokAnnotation(dtoClassDefinition);

        const fields = definition.properties.map(prop => {
            return DTOGenerator.generateField(prop);
        });

        dtoClassDefinition.fields = fields;
        return dtoClassDefinition;
    }

    /**
     * 生成java文件
     * @param definition
     * @param text
     * @private
     */
    private static generateJavaFile(definition: ObjectTypeDefinition, text: string) {
        const filePath = config.baseDir + `\\${getJavaFilePath(getDomainPackage(definition.packageName),definition.className)}`;
        const fileDir = getParent(filePath);
        if (!exist(fileDir))
            mkdirs(fileDir);
        writeStringToFile(filePath,text)
    }

    /**
     * 添加lombok注解
     * @param definition
     * @private
     */
    private static addLombokAnnotation(definition: ClassDefinition) {
        definition.addAnnotation(LombokAnnotationDefinitions.DATA);
        definition.addAnnotation(LombokAnnotationDefinitions.NO_ARGS_CONSTRUCTOR);
        definition.addAnnotation(LombokAnnotationDefinitions.ALL_ARGS_CONSTRUCTOR);
        definition.addAnnotation(LombokAnnotationDefinitions.BUILDER);
    }

    /**
     * 将属性定义转换为字段定义。
     * @param prop
     * @private
     */
    private static generateField(prop: IPropertyDefinition) {

        const fieldDefinition = new FieldDefinition(prop.paramName,prop.paramType,prop.paramDesc);

        if (isOfType<IDomainPropertyDefinition>(prop, "isPrimaryKey"))
        {
            fieldDefinition.addAnnotation(JPAAnnotationDefinitions.Id);
        }
        if (isOfType<IDomainPropertyDefinition>(prop, "autoIncrement"))
        {
            fieldDefinition.addAnnotation(JPAAnnotationDefinitions.GeneratedValue);
        }
        if (prop.timePattern)
        {
            fieldDefinition.addAnnotation(JsonAnnotationDefinitions.jsonField(prop.timePattern));
            fieldDefinition.addAnnotation(JsonAnnotationDefinitions.jsonFormat(prop.timePattern));
        }

        return fieldDefinition;

    }

    /**
     * 生成包名。
     * @param definition
     * @private
     */
    private static generatePackage(definition: ObjectTypeDefinition) {
        if (definition instanceof DomainTypeDefinition)
            return getDomainPackage(definition.packageName);
        else
            return getDtoPackage(definition.packageName);
    }

}