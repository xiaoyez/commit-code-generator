import {ModuleDefinition} from "../definition/ModuleDefinition";
import {ModuleUtils} from "../utils/ModuleUtils";
import {AjaxResultTypeDefinition} from "../definition/AjaxResultTypeDefinition";
import {TableDataInfoTypeDefinition} from "../definition/TableDataInfoTypeDefinition";
import {ObjectTypeDefinition, TypeDefinition} from "../../dto/definition/TypeDefinition";
import {getDomainPackage} from "../../utils/JavaUtils";
import {ApiDefinition} from "../definition/ApiDefinition";
import {RequestMethod} from "../definition/RequestMethod";
import {config} from "../../config/Config";
import {exist, mkdirs, writeStringToFile} from "../../utils/FileUtils";

export class ServiceGenerator {

    static generate(module: ModuleDefinition) {
        if (!module.isFile) {
            return;
        }
        let text = '';
        const packageName = ModuleUtils.buildPackageName(module) + '.service';
        text += `package ${packageName};\n\n`;
        text += ServiceGenerator.addImport(module, packageName);
        text += `public interface I${module.moduleName}Service {\n\n`;
        text += module.apis?.map(api => ServiceGenerator.buildService(api)).join('\n\n') || '';
        text += `\n}\n`;
        // 创建java文件并写入内容
        ServiceGenerator.writeFile(packageName,text,module.moduleName);
    }

    private static addImport(module: ModuleDefinition, packageName: string) {
        let imports = new Set<string>();
        imports.add(`import ${packageName}.${ServiceGenerator.getServiceName(module.moduleName)};\n`);
        // import apis resultType and paramsType
        module.apis?.forEach(api => {
            if (api.result && (api.result instanceof AjaxResultTypeDefinition || api.result instanceof TableDataInfoTypeDefinition)) {
                const genericTypes = api.result.genericTypes;
                if (genericTypes) {
                    genericTypes.forEach(type => {
                        if (type.type instanceof ObjectTypeDefinition) {
                            imports.add(`import ${getDomainPackage(type.type.packageName)}.${type.type.className};\n`);
                        }
                    })
                }
            }
            if (api.params) {
                if(api.params.type instanceof ObjectTypeDefinition)
                    imports.add(`import ${getDomainPackage(api.params.type.packageName)}.${api.params.type.className};\n`);
            }
        });
        return Array.from(imports).join('') + '\n';
    }

    private static getServiceName(moduleName: string) {
        return `I${moduleName.replace('Controller', '')}Service`;
    }

    static buildService(api: ApiDefinition) {
        let text = '';
        const resultType = ServiceGenerator.buildResultType(api);
        text += `    ${resultType} ${api.apiName}(${ModuleUtils.buildParams(api.params)});`;
        return text;
    }

    private static buildResultType(api: ApiDefinition) {
        if (api.result && (api.result instanceof AjaxResultTypeDefinition || api.result instanceof TableDataInfoTypeDefinition)) {
            if (api.result.genericTypes && api.result.genericTypes.length > 0) {
                const type = api.result.genericTypes[0];
                let typeName = '';
                if (type.type instanceof ObjectTypeDefinition) {
                    typeName = type.type.className;
                }
                else
                    typeName = type.type;
                if (api.result instanceof TableDataInfoTypeDefinition)
                    typeName = `List<${typeName}>`;
                return typeName;
            }
        }
        return 'int';
    }

    private static writeFile(packageName: string, content: string, moduleName: string) {
        const path = `${config.baseDir}\\${packageName.replace(/\./g, '\\')}`;
        if (!exist(path))
            mkdirs(path);
        const file = `${path}\\${ServiceGenerator.getServiceName(moduleName)}.java`;
        writeStringToFile(file, content);
    }
}