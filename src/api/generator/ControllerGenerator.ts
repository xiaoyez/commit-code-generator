import {ModuleDefinition} from "../definition/ModuleDefinition";
import {ApiDefinition} from "../definition/ApiDefinition";
import {ObjectTypeDefinition, TypeDefinition} from "../../dto/definition/TypeDefinition";
import {RequestMethod} from "../definition/RequestMethod";
import {lowerFirst, upperFirst} from "lodash";
import {config} from "../../config/Config";
import {exist, mkdirs, writeStringToFile} from "../../utils/FileUtils";
import {DTOGenerator} from "../../dto/generator/DTOGenerator";

export class ControllerGenerator {
    static generate(module: ModuleDefinition) {
        if(!module.isFile) {
            return;
        }
        let text = '';
        const packageName = ControllerGenerator.buildPackageName(module);
        text += `package ${packageName}.controller;\n\n`;
        text += ControllerGenerator.addImport(module,packageName);

        text += `@RestController\n`;
        text += `@RequestMapping("${ControllerGenerator.buildBaseUrlPrefix(module)}")\n`;
        text += `public class ${module.moduleName}Controller {\n\n`;
        text += ControllerGenerator.addService(module);
        text += module.apis?.map(api => ControllerGenerator.buildApi(api)).join('\n\n') || '';
        text += `}\n`;

        // 创建java文件并写入内容
        ControllerGenerator.writeFile(packageName,text);
        // 生成入参java文件
        ControllerGenerator.generateParamDTOs(module);
    }

    private static buildPackageName(module: ModuleDefinition) {
        let packageName = '';
        let parent = module.parent;
        while (parent) {
            packageName = parent.moduleName + '.' + packageName;
            parent = parent.parent;
        }
        // 删除最后一个.
        packageName = packageName.substring(0, packageName.length - 1);
        return packageName;
    }

    private static addImport(module: ModuleDefinition,packageName:string) {

        let text = '';
        text += `import org.springframework.web.bind.annotation.RestController;\n`;
        text += `import org.springframework.web.bind.annotation.RequestMapping;\n`;
        text += `import org.springframework.web.bind.annotation.GetMapping;\n`;
        text += `import org.springframework.web.bind.annotation.PostMapping;\n`;
        text += `import org.springframework.web.bind.annotation.PutMapping;\n`;
        text += `import org.springframework.web.bind.annotation.DeleteMapping;\n`;
        text += `import org.springframework.web.bind.annotation.RequestBody;\n`;
        text += `import org.springframework.web.bind.annotation.PathVariable;\n`;
        text += `import org.springframework.beans.factory.annotation.Autowired;\n`;
        // import service
        text += `import ${packageName}.service.I${module.moduleName}Service;\n`;
        // import AjaxResult and TableDataInfo
        text += `import ${config.projectPackage}.core.domain.AjaxResult;\n`;
        text += `import ${config.projectPackage}.core.page.TableDataInfo;\n`;
        text += '\n';
        return text;
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
        const resultType = ControllerGenerator.buildResultType(api.result);
        text += `    public ${resultType} ${api.apiName}(${(api.method === RequestMethod.POST || api.method === RequestMethod.PUT)?'@RequestBody ':''}${ControllerGenerator.buildParams(api.params)}) {\n`;
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

    private static buildResultType(result: TypeDefinition | undefined) {
        return ControllerGenerator.buildTypeNameByTypeDefinition(result);
    }

    private static buildParams(params: TypeDefinition | undefined) {
        return ControllerGenerator.buildTypeNameByTypeDefinition(params) + ' ' + ControllerGenerator.buildParamsName(params);
    }

    private static buildParamsName(params: TypeDefinition | undefined) {
        if (!params) {
            return '';
        }
        let typeName = '';
        if(params.type instanceof ObjectTypeDefinition)
        {
            typeName = params.type.className;
        }
        else
        {
            typeName = params.type;
        }
        // 参数名
        let paramName = lowerFirst(typeName);
        return paramName;
    }

    private static buildTypeNameByTypeDefinition(type: TypeDefinition | undefined) {
        if (!type) {
            return 'void';
        }
        let typeName = '';
        if(type.type instanceof ObjectTypeDefinition)
        {
            typeName = type.type.className;
        }
        else
        {
            typeName = type.type;
        }
        // 加泛型
        if (type.genericTypes && type.genericTypes.length > 0) {
            typeName += '<';
            typeName += type.genericTypes.map(type => ControllerGenerator.buildResultType(type)).join(',');
            typeName += '>';
        }
        return typeName;
    }


    private static buildReturnStatement(api: ApiDefinition, resultType: string) {
        const service = (api.module?.moduleName?lowerFirst(api.module.moduleName.replace('Controller','')) : '')+ 'Service';
        if (resultType === 'void') {
            return `        ${service}.${api.apiName}(${ControllerGenerator.buildParamsName(api.params)});\n`;
        }
        if (resultType.startsWith('AjaxResult') && [RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE].find(method => method === api.method)) {
            return `        return AjaxResult.toAjax(${service}.${api.apiName}(${ControllerGenerator.buildParamsName(api.params)}));\n`;
        }
        if (resultType.startsWith('AjaxResult') && api.method === RequestMethod.GET) {
            return `        return AjaxResult.success(${service}.${api.apiName}(${ControllerGenerator.buildParamsName(api.params)}));\n`;
        }
        if (resultType.startsWith('TableDataInfo')) {
            // PageUtil.startPage();
            let text = '';
            text += `        PageUtil.startPage();\n`;
            text += `        List<${ControllerGenerator.buildResultType(api.result?.genericTypes?.[0])}> list = ${service}.${api.apiName}(${ControllerGenerator.buildParamsName(api.params)});\n`;
            text += `        return PageUtil.getDataTable(list);\n`;
            return text;
        }
        return '';
    }

    private static writeFile(packageName: string, content:string) {
        const path = `${config.baseDir}\\${packageName.replace(/\./g, '\\')}`;
        if (!exist(path))
            mkdirs(path);
        const className = upperFirst(packageName.substring(packageName.lastIndexOf('.') + 1));
        const file = `${path}\\${className}Controller.java`;
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