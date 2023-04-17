import {ModuleDefinition} from "../definition/ModuleDefinition";
import {ApiDefinition} from "../definition/ApiDefinition";
import {ObjectTypeDefinition, TypeDefinition} from "../../dto/definition/TypeDefinition";
import {RequestMethod} from "../definition/RequestMethod";
import {lowerFirst, upperFirst} from "lodash";
import {config} from "../../config/Config";
import {exist, mkdirs, writeStringToFile} from "../../utils/FileUtils";
import {DTOGenerator} from "../../dto/generator/DTOGenerator";
import {ModuleUtils} from "../utils/ModuleUtils";
import {getDomainPackage} from "../../utils/JavaUtils";
import {AjaxResultTypeDefinition} from "../definition/AjaxResultTypeDefinition";
import {TableDataInfoTypeDefinition} from "../definition/TableDataInfoTypeDefinition";

export class ControllerGenerator {
    static generate(module: ModuleDefinition) {
        if(!module.isFile) {
            return;
        }
        let text = '';
        const packageName = ModuleUtils.buildPackageName(module)+ '.controller';
        text += `package ${packageName};\n\n`;
        text += ControllerGenerator.addImport(module,packageName);

        text += `@RestController\n`;
        text += `@RequestMapping("${ControllerGenerator.buildBaseUrlPrefix(module)}")\n`;
        text += `public class ${module.moduleName} {\n\n`;
        text += ControllerGenerator.addService(module);
        text += module.apis?.map(api => ControllerGenerator.buildApi(api)).join('\n\n') || '';
        text += `}\n`;

        // 创建java文件并写入内容
        ControllerGenerator.writeFile(packageName,text,module.moduleName);
        // 生成入参java文件
        ControllerGenerator.generateParamDTOs(module);
    }


    private static addImport(module: ModuleDefinition,packageName:string) {
        const imports = new Set<string>();
        imports.add(`import org.springframework.web.bind.annotation.RestController;\n`);
        imports.add(`import org.springframework.web.bind.annotation.RequestMapping;\n`);
        imports.add(`import org.springframework.web.bind.annotation.GetMapping;\n`);
        imports.add(`import org.springframework.web.bind.annotation.PostMapping;\n`);
        imports.add(`import org.springframework.web.bind.annotation.PutMapping;\n`);
        imports.add(`import org.springframework.web.bind.annotation.DeleteMapping;\n`);
        imports.add(`import org.springframework.web.bind.annotation.RequestBody;\n`);
        imports.add(`import org.springframework.web.bind.annotation.PathVariable;\n`);
        imports.add(`import org.springframework.beans.factory.annotation.Autowired;\n`);
        // import service
        imports.add(`import ${packageName}.service.I${module.moduleName}Service;\n`);
        // import AjaxResult and TableDataInfo
        imports.add(`import ${config.projectPackage}.core.domain.AjaxResult;\n`);
        imports.add(`import ${config.projectPackage}.core.page.TableDataInfo;\n`);
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

    private static buildBaseUrlPrefix(module: ModuleDefinition) {
        let baseUrlPrefix = module.baseUrlPrefix;
        let parent = module.parent;
        while (parent) {
            baseUrlPrefix = parent.baseUrlPrefix + baseUrlPrefix;
            parent = parent.parent;
        }
        baseUrlPrefix += module.baseUrlPrefix;
        return baseUrlPrefix;
    }

    private static addService(module: ModuleDefinition) {
        let text = '';
        text += `    @Autowired\n`;
        text += `    private I${module.moduleName.replace('Controller','')}Service ${lowerFirst(module.moduleName.replace('Controller',''))}Service;\n\n`;
        return text;

    }

    static buildApi(api: ApiDefinition) {
        let text = '';
        text += `    @${ControllerGenerator.buildMethod(api.method)}("${api.url}")\n`;
        const resultType = ModuleUtils.buildResultType(api.result);
        text += `    public ${resultType} ${api.apiName}(${(api.method === RequestMethod.POST || api.method === RequestMethod.PUT)?'@RequestBody ':''}${ModuleUtils.buildParams(api.params)}) {\n`;
        text += ControllerGenerator.buildReturnStatement(api,resultType);
        text += `    }\n`;
        return text;
    }

    private static buildMethod(method: RequestMethod) {
        switch (method) {
            case RequestMethod.GET:
                return 'GetMapping';
            case RequestMethod.POST:
                return 'PostMapping';
            case RequestMethod.PUT:
                return 'PutMapping';
            case RequestMethod.DELETE:
                return 'DeleteMapping';
        }
    }

    private static buildReturnStatement(api: ApiDefinition, resultType: string) {
        const service = (api.module?.moduleName?lowerFirst(api.module.moduleName.replace('Controller','')) : '')+ 'Service';
        if (resultType === 'void') {
            return `        ${service}.${api.apiName}(${ModuleUtils.buildParamsName(api.params)});\n`;
        }
        if (resultType.startsWith('AjaxResult') && [RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE].find(method => method === api.method)) {
            return `        return AjaxResult.toAjax(${service}.${api.apiName}(${ModuleUtils.buildParamsName(api.params)}));\n`;
        }
        if (resultType.startsWith('AjaxResult') && api.method === RequestMethod.GET) {
            return `        return AjaxResult.success(${service}.${api.apiName}(${ModuleUtils.buildParamsName(api.params)}));\n`;
        }
        if (resultType.startsWith('TableDataInfo')) {
            // PageUtil.startPage();
            let text = '';
            text += `        PageUtil.startPage();\n`;
            text += `        List<${ModuleUtils.buildResultType(api.result?.genericTypes?.[0])}> list = ${service}.${api.apiName}(${ModuleUtils.buildParamsName(api.params)});\n`;
            text += `        return PageUtil.getDataTable(list);\n`;
            return text;
        }
        return '';
    }

    private static writeFile(packageName: string, content:string, moduleName: string) {
        const path = `${config.baseDir}\\${packageName.replace(/\./g, '\\')}`;
        if (!exist(path))
            mkdirs(path);
        const file = `${path}\\${moduleName}.java`;
        writeStringToFile(file, content);

    }

    private static generateParamDTOs(module: ModuleDefinition) {
        module.apis?.forEach(api => {
            if (api.params) {
                if (api.params.type instanceof ObjectTypeDefinition)
                    DTOGenerator.generate(api.params.type);
            }
        });
    }
}