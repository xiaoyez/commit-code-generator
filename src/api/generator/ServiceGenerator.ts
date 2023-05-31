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
import {getFullPackageName, PackageType} from "../../utils/PackageUtils";

export class ServiceGenerator {

    /**
     * 生成Service文件
     * @param module
     */
    static generate(module: ModuleDefinition) {
        if (!module.isFile) {
            return;
        }
        const packageName = getFullPackageName(PackageType.SERVICE, ModuleUtils.buildPackageName(module));
        const serviceInterfaceDefinition = ServiceGenerator.buildServiceInterfaceDefinition(module);
        // 创建java文件并写入内容
        ServiceGenerator.writeFile(packageName,InterfaceGenerator.generate(serviceInterfaceDefinition),module.moduleName);
    }

    /**
     * 构建service的InterfaceDefinition
     * @param module
     */
    static buildServiceInterfaceDefinition(module: ModuleDefinition) {
        const packageName = ModuleUtils.buildPackageName(module) + '.service';

        const serviceInterfaceAnnotation = new InterfaceDefinition(packageName, ServiceGenerator.getServiceName(module.moduleName), [],[],module.comment.replace('Controller','Service'));

        const methods: MethodDefinition[] = module.apis?.map(api => ServiceGenerator.buildMethod(api));

        serviceInterfaceAnnotation.methods = methods;
        return serviceInterfaceAnnotation;
    }

    /**
     * 获取Service名称
     * @param moduleName
     * @private
     */
    private static getServiceName(moduleName: string) {
        return `I${moduleName.replace('Controller', '')}Service`;
    }

    /**
     * 构建返回值类型
     * @param api
     * @private
     */
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

    /**
     * 创建java文件并写入内容
     * @param packageName
     * @param content
     * @param moduleName
     * @private
     */
    private static writeFile(packageName: string, content: string, moduleName: string) {
        const path = `${config.baseDir}\\${config.projectName}\\${packageName.replace(/\./g, '\\')}`;
        if (!exist(path))
            mkdirs(path);
        const file = `${path}\\${ServiceGenerator.getServiceName(moduleName)}.java`;
        writeStringToFile(file, content);
    }

    /**
     * 构建方法
     * @param api
     * @private
     */
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