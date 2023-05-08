import {ModuleDefinition} from "../definition/ModuleDefinition";
import {ModuleUtils} from "../utils/ModuleUtils";
import {AjaxResultTypeDefinition} from "../definition/AjaxResultTypeDefinition";
import {TableDataInfoTypeDefinition} from "../definition/TableDataInfoTypeDefinition";
import {TypeDefinition} from "../../dto/definition/TypeDefinition";
import {ApiDefinition} from "../definition/ApiDefinition";
import {config} from "../../config/Config";
import {exist, mkdirs, writeStringToFile} from "../../utils/FileUtils";
import {InterfaceDefinition} from "../../java/definition/InterfaceDefinition";
import {MethodDefinition} from "../../java/definition/MethodDefinition";
import {JavaType} from "../../dto/definition/JavaType";
import {InterfaceGenerator} from "../../java/generator/InterfaceGenerator";
import {ParameterDefinition} from "../../java/definition/ParameterDefinition";

export class ServiceGenerator {

    static generate(module: ModuleDefinition) {
        if (!module.isFile) {
            return;
        }
        const packageName = ModuleUtils.buildPackageName(module) + '.service';
        const serviceInterfaceDefinition = ServiceGenerator.buildServiceInterfaceDefinition(module);
        // 创建java文件并写入内容
        ServiceGenerator.writeFile(packageName,InterfaceGenerator.generate(serviceInterfaceDefinition),module.moduleName);
    }

    static buildServiceInterfaceDefinition(module: ModuleDefinition) {
        const packageName = ModuleUtils.buildPackageName(module) + '.service';

        const serviceInterfaceAnnotation = new InterfaceDefinition(packageName, ServiceGenerator.getServiceName(module.moduleName));

        const methods: MethodDefinition[] = module.apis?.map(api => ServiceGenerator.buildMethod(api));

        serviceInterfaceAnnotation.methods = methods;
        return serviceInterfaceAnnotation;
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
                if (api.result instanceof TableDataInfoTypeDefinition)
                    return TypeDefinition.create(JavaType.List, [type]);
                else
                    return type;
            }
        }
        return TypeDefinition.create(JavaType.int);
    }

    private static writeFile(packageName: string, content: string, moduleName: string) {
        const path = `${config.baseDir}\\${packageName.replace(/\./g, '\\')}`;
        if (!exist(path))
            mkdirs(path);
        const file = `${path}\\${ServiceGenerator.getServiceName(moduleName)}.java`;
        writeStringToFile(file, content);
    }

    private static buildMethod(api: ApiDefinition) {
        const methodDefinition = new MethodDefinition(api.apiName,ServiceGenerator.buildResultType(api),api.comment);
        if (api.params)
        {
            const paramDefinition = new ParameterDefinition(ModuleUtils.buildParamsName(api.params),TypeDefinition.create(api.params.type,api.params.genericTypes));
            methodDefinition.addParameter(paramDefinition);
        }
        return methodDefinition;

    }
}