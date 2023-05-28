import {DomainTypeDefinition} from "../definition/TypeDefinition";
import {config} from "../../config/Config";
import {exist, mkdirs, writeStringToFile} from "../../utils/FileUtils";
import {InterfaceDefinition} from "../../java/definition/InterfaceDefinition";
import {XyMapperDefinitions} from "../../java/definition/common/XyMapperDefinitions";
import {DTOGenerator} from "./DTOGenerator";
import {InterfaceGenerator} from "../../java/generator/InterfaceGenerator";

export class MapperGenerator {

    /**
     * 生成Mapper接口。
     * @param domain
     */
    static generate(domain: DomainTypeDefinition) {

        const mapperDefinition = new InterfaceDefinition(`${config.projectPackage}.${config.mapperPackage}`, `${domain.className}Mapper`);
        mapperDefinition.comment = domain.comment + 'Mapper接口';

        const domainClassDefinition = DTOGenerator.castToClassDefinition(domain);

        mapperDefinition.addBaseInterface(XyMapperDefinitions.mapper(domainClassDefinition));
        mapperDefinition.addBaseInterface(XyMapperDefinitions.batchMapper(domainClassDefinition));
        mapperDefinition.addBaseInterface(XyMapperDefinitions.searchMapper(domainClassDefinition));

        MapperGenerator.writeFile(domain, InterfaceGenerator.generate(mapperDefinition));
    }

    /**
     * 生成Mapper接口文件
     * @param domain
     * @param content
     * @private
     */
    private static writeFile(domain: DomainTypeDefinition, content: string) {
        const path = `${config.baseDir}\\${config.projectPackage.replace(/\./g, '\\')}\\${config.mapperPackage}`;
        const fileName = `${domain.className}Mapper.java`;
        const filePath = `${path}\\${fileName}`;
        if (!exist(path)) {
            mkdirs(path);
        }
        writeStringToFile(filePath, content);
    }
}