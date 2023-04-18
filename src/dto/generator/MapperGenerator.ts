import {DomainTypeDefinition} from "../definition/TypeDefinition";
import {config} from "../../config/Config";
import {getDomainPackage} from "../../utils/JavaUtils";
import {exist, mkdirs, writeStringToFile} from "../../utils/FileUtils";

export class MapperGenerator {
    static generate(domain: DomainTypeDefinition) {
        let text = '';
        text += `package ${config.basePackage}.${config.mapperPackage};\n\n`;

        text += MapperGenerator.addImport(domain);

        text += `public interface ${domain.className}Mapper extends Mapper<${domain.className}>, ISearchMapper<${domain.className}>, IBatchMapper<${domain.className}> {\n\n`;
        text += `}\n`;

        MapperGenerator.writeFile(domain, text);
    }

    private static addImport(domain: DomainTypeDefinition) {
        let text = '';
        text += `import com.xy.common.mapper.IBatchMapper;
import com.xy.common.mapper.ISearchMapper;
import com.xy.common.mapper.Mapper;\n`;
        text += `import java.util.List;\n`;
        text += `\nimport ${getDomainPackage(domain.packageName)}.${domain.className};\n\n`;
        return text;
    }

    private static writeFile(domain: DomainTypeDefinition, content: string) {
        const path = `${config.baseDir}\\${config.basePackage.replace(/\./g, '\\')}\\${config.mapperPackage}`;
        const fileName = `${domain.className}Mapper.java`;
        const filePath = `${path}\\${fileName}`;
        if (!exist(path)) {
            mkdirs(path);
        }
        writeStringToFile(filePath, content);
    }
}