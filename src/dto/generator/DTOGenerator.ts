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
import {getDomainPackage, getJavaFilePath} from "../../utils/JavaUtils";
import {ClassDefinition} from "../../java/definition/ClassDefinition";
import {LombokAnnotationDefinitions} from "../../java/definition/common/LombokAnnotationDefinitions";
import {FieldDefinition} from "../../java/definition/FieldDefinition";
import {JPAAnnotationDefinitions} from "../../java/definition/common/JPAAnnotationDefinitions";
import {JsonAnnotationDefinitions} from "../../java/definition/common/JsonAnnotationDefinitions";
import {ClassGenerator} from "../../java/generator/ClassGenerator";

export class DTOGenerator {
    static generate(definition: ObjectTypeDefinition) {

        const packageName = DTOGenerator.generatePackage(definition);

        const dtoClassDefinition = new ClassDefinition(packageName,definition.className);

        DTOGenerator.addLombokAnnotation(dtoClassDefinition);

        const fields = definition.properties.map(prop => {
            return DTOGenerator.generateField(prop);
        });

        dtoClassDefinition.fields = fields;

        // 生成.java文件
        DTOGenerator.generateJavaFile(definition, ClassGenerator.generate(dtoClassDefinition));
    }

    private static generateJavaFile(definition: ObjectTypeDefinition, text: string) {
        const filePath = config.baseDir + `\\${getJavaFilePath(getDomainPackage(definition.packageName),definition.className)}`;
        const fileDir = getParent(filePath);
        if (!exist(fileDir))
            mkdirs(fileDir);
        writeStringToFile(filePath,text)
    }

    private static addLombokAnnotation(definition: ClassDefinition) {
        definition.addAnnotation(LombokAnnotationDefinitions.DATA);
        definition.addAnnotation(LombokAnnotationDefinitions.NO_ARGS_CONSTRUCTOR);
        definition.addAnnotation(LombokAnnotationDefinitions.ALL_ARGS_CONSTRUCTOR);
        definition.addAnnotation(LombokAnnotationDefinitions.BUILDER);
    }

    private static generateClass(definition: ObjectTypeDefinition) {
        let classText = "";
        classText += `public class ${definition.className} {\n`;
        definition.properties.forEach(prop => {
            classText += DTOGenerator.generateField(prop);
        });
        classText += `}\n`;
        return classText;
    }

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

    private static generatePackage(definition: ObjectTypeDefinition) {
        return getDomainPackage(definition.packageName);
    }

    private static addJPAAnnotation(prop: IDomainPropertyDefinition, importSet: Set<string>) {
        if (prop.isPrimaryKey)
        {
            importSet.add("javax.persistence.Id");
        }
        importSet.add("javax.persistence.Column");
        if (prop.autoIncrement)
        {
            importSet.add("javax.persistence.GeneratedValue");
            importSet.add("javax.persistence.GenerationType");
        }
    }
}