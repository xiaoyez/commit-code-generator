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

export class DTOGenerator {
    static generate(definition: ObjectTypeDefinition) {
        let text = '';

        text += DTOGenerator.generatePackage(definition);

        text += DTOGenerator.generateImports(definition);

        text += DTOGenerator.addLombokAnnotation();

        text += DTOGenerator.generateClass(definition);

        // 生成.java文件
        DTOGenerator.generateJavaFile(definition, text);
    }

    static generateDomain(definition: DomainTypeDefinition) {
        let text = '';

        text += DTOGenerator.generatePackage(definition);

        text += DTOGenerator.generateImports(definition);

        text += DTOGenerator.generateClassComment(definition);

        text += DTOGenerator.addLombokAnnotation();

        text += DTOGenerator.generateClass(definition);

        // 生成.java文件
        DTOGenerator.generateJavaFile(definition, text);
    }

    private static generateJavaFile(definition: ObjectTypeDefinition, text: string) {
        const filePath = config.baseDir + `\\${getJavaFilePath(getDomainPackage(definition.packageName),definition.className)}`;
        const fileDir = getParent(filePath);
        if (!exist(fileDir))
            mkdirs(fileDir);
        writeStringToFile(filePath,text)
    }

    private static generateImports(definition: ObjectTypeDefinition) {
        const importSet = new Set<string>();
        definition.properties.forEach(prop => {

            if (prop.paramType.type instanceof ObjectTypeDefinition) {
                if (prop.paramType.type.packageName !== definition.packageName)
                    importSet.add(`${prop.paramType.type.packageName}.${prop.paramType.type.className}`) ;
            }
            if (prop.paramType.genericTypes) {
                prop.paramType.genericTypes.forEach(type => {
                    if (type.type instanceof ObjectTypeDefinition) {
                        if (type.type.packageName !== definition.packageName)
                            importSet.add(`${type.type.packageName}.${type.type.className}`);
                    }
                })
            }
            if (prop.paramType.type === JavaType.Date)
            {
                importSet.add("java.util.Date");
                importSet.add("com.fasterxml.jackson.annotation.JsonFormat");
                importSet.add("com.fastjson.annotation.JSONField");
            }
            if (definition instanceof DomainTypeDefinition)
            {
                DTOGenerator.addJPAAnnotation(prop as IDomainPropertyDefinition, importSet);
            }
        })

        let importText = "";
        Array.from(importSet).forEach(imp => {
            importText += `import ${imp};\n`;
        });

        // import lombok.Data;等
        importText += `import lombok.Data;\n`;
        importText += `import lombok.NoArgsConstructor;\n`;
        importText += `import lombok.AllArgsConstructor;\n`;
        importText += `import lombok.Builder;\n`;
        importText += '\n';

        return importText;
    }

    private static addLombokAnnotation() {
        let annotationText = "";
        annotationText += `@Data\n`;
        annotationText += `@NoArgsConstructor\n`;
        annotationText += `@AllArgsConstructor\n`;
        annotationText += `@Builder\n`;
        return annotationText;
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
        let fieldText = "";
        // 生成注释
        const comment =
`
    /**
     * ${prop.paramDesc}
     */
`
        fieldText += comment;

        if (isOfType<IDomainPropertyDefinition>(prop, "isPrimaryKey"))
        {
            fieldText += `\t@Id\n`;
        }
        if (isOfType<IDomainPropertyDefinition>(prop, "autoIncrement"))
        {
            fieldText += `\t@GeneratedValue(strategy = GenerationType.IDENTITY)\n`;
        }

        fieldText += prop.timePattern ? `\t@JsonFormat(pattern = "${prop.timePattern}", timezone = "GMT+8")\n` : '';
        fieldText += prop.timePattern ? `\t@JSONField(format = "${prop.timePattern}")\n` : '';
        fieldText += `\tprivate ${DTOGenerator.generateType(prop.paramType)} ${prop.paramName};\n`;
        return fieldText;
    }

    private static generateType(paramType: TypeDefinition) {
        let typeText = "";
        if (paramType.type instanceof ObjectTypeDefinition) {
            typeText += `${paramType.type.className}`;
        }
        else if (paramType.type === JavaType.Date) {
            typeText += "Date";
        }
        else {
            typeText += `${paramType.type}`;
        }
        return typeText;
    }

    private static generatePackage(definition: ObjectTypeDefinition) {
        return `package ${getDomainPackage(definition.packageName)};\n\n`;
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

    private static generateClassComment(definition: DomainTypeDefinition) {
        return '/**\n' +
            ` * ${definition.comment}\n` +
            ' */\n';

    }
}