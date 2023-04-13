import {IPropertyDefinition, ObjectTypeDefinition, TypeDefinition} from "../definition/TypeDefinition";
import {JavaType} from "../definition/JavaType";

export class DTOGenerator {
    static generate(definition: ObjectTypeDefinition) {
        let text = '';

        text += DTOGenerator.generatePackage(definition);

        text += DTOGenerator.generateImports(definition);

        text += DTOGenerator.addLombokAnnotation();

        text += DTOGenerator.generateClass(definition);

        // 生成.java文件
        const filePath = `${definition.packageName.replace(/\./g, '/')}/${definition.className}.java`;


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
        return `package ${definition.packageName};\n\n`;
    }
}