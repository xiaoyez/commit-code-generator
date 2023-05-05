import {DomainTypeDefinition} from "../definition/TypeDefinition";
import {config} from "../../config/Config";
import {exist, mkdirs, writeStringToFile} from "../../utils/FileUtils";
import {InterfaceDefinition} from "../../java/definition/InterfaceDefinition";
import {XyMapperDefinitions} from "../../java/definition/common/XyMapperDefinitions";
import {DTOGenerator} from "./DTOGenerator";
import {InterfaceGenerator} from "../../java/generator/InterfaceGenerator";

export class MapperGenerator {
    static generate(domain: DomainTypeDefinition) {

        const mapperDefinition = new InterfaceDefinition(`${config.basePackage}.${config.mapperPackage}`, `${domain.className}Mapper`);
        mapperDefinition.comment = domain.comment + 'Mapper接口';

        const domainClassDefinition = DTOGenerator.castToClassDefinition(domain);

        mapperDefinition.addBaseInterface(XyMapperDefinitions.mapper(domainClassDefinition));
        mapperDefinition.addBaseInterface(XyMapperDefinitions.batchMapper(domainClassDefinition));
        mapperDefinition.addBaseInterface(XyMapperDefinitions.searchMapper(domainClassDefinition));

        MapperGenerator.writeFile(domain, InterfaceGenerator.generate(mapperDefinition));
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