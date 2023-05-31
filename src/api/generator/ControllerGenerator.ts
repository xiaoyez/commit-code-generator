import {ModuleDefinition} from "../definition/ModuleDefinition";
import {ApiDefinition} from "../definition/ApiDefinition";
import {ObjectTypeDefinition, TypeDefinition} from "../../dto/definition/TypeDefinition";
import {RequestMethod} from "../definition/RequestMethod";
import {lowerFirst} from "lodash";
import {config} from "../../config/Config";
import {exist, mkdirs, writeStringToFile} from "../../utils/FileUtils";
import {DTOGenerator} from "../../dto/generator/DTOGenerator";
import {ModuleUtils} from "../utils/ModuleUtils";
import {ClassDefinition} from "../../java/definition/ClassDefinition";
import {SpringAnnotationDefinitions} from "../../java/definition/common/SpringAnnotationDefinitions";
import {ServiceGenerator} from "./ServiceGenerator";
import {FieldDefinition} from "../../java/definition/FieldDefinition";
import {MethodDefinition} from "../../java/definition/MethodDefinition";
import {JavaType} from "../../dto/definition/JavaType";
import {ClassGenerator} from "../../java/generator/ClassGenerator";
import {
    AjaxResultTypeDefinition,
    castAjaxResultTypeDefinitionToClassDefinition
} from "../definition/AjaxResultTypeDefinition";
import {
    castTableDataInfoTypeDefinitionToClassDefinition,
    TableDataInfoTypeDefinition
} from "../definition/TableDataInfoTypeDefinition";
import {getFullPackageName, PackageType} from "../../utils/PackageUtils";

export class ControllerGenerator {

    /**
     * 生成Controller文件
     * @param module
     */
    static generate(module: ModuleDefinition) {
        if(!module.isFile) {
            return;
        }
        const packageName = getFullPackageName(PackageType.CONTROLLER, ModuleUtils.buildPackageName(module));

        const controllerClassDefinition = ControllerGenerator.castToClassDefinition(packageName, module);

        // 创建java文件并写入内容
        ControllerGenerator.writeFile(packageName,ClassGenerator.generate(controllerClassDefinition),module.moduleName);
        // 生成入参java文件
        ControllerGenerator.generateParamDTOs(module);
    }

    /**
     * 将ModuleDefinition转换为ClassDefinition
     * @param packageName
     * @param module
     */
    static castToClassDefinition(packageName: string, module: ModuleDefinition) {
        const controllerClassDefinition = new ClassDefinition(packageName, module.moduleName);

        ControllerGenerator.addSpringAnnotations(controllerClassDefinition, module);

        ControllerGenerator.addServiceField(module, controllerClassDefinition);

        ControllerGenerator.buildMethods(module, controllerClassDefinition);
        return controllerClassDefinition;
    }

    /**
     * 构建方法
     * @param module
     * @param controllerClassDefinition
     * @private
     */
    private static buildMethods(module: ModuleDefinition, controllerClassDefinition: ClassDefinition) {
        const methods = module.apis?.map(api => ControllerGenerator.buildMethod(api));
        controllerClassDefinition.methods = methods;
    }

    /**
     * 添加service字段
     * @param module
     * @param controllerClassDefinition
     * @private
     */
    private static addServiceField(module: ModuleDefinition, controllerClassDefinition: ClassDefinition) {
        const serviceName = lowerFirst(module.moduleName.replace('Controller', '')) + 'Service';
        const serviceFieldDefinition = new FieldDefinition(serviceName, ServiceGenerator.buildServiceInterfaceDefinition(module));
        serviceFieldDefinition.addAnnotation(SpringAnnotationDefinitions.Autowired);
        controllerClassDefinition.fields.push(serviceFieldDefinition);
    }

    /**
     * 添加Spring 注解
     * @param controllerClassDefinition
     * @param module
     * @private
     */
    private static addSpringAnnotations(controllerClassDefinition: ClassDefinition, module: ModuleDefinition) {
        // 添加注解
        controllerClassDefinition.addAnnotation(SpringAnnotationDefinitions.RestController);
        controllerClassDefinition.addAnnotation(SpringAnnotationDefinitions.RequestMapping(ModuleUtils.buildBaseUrlPrefix(module)));
    }

    /**
     * 根据api构建方法
     * @param api
     */
    static buildMethod(api: ApiDefinition) {
        let resultType: TypeDefinition|ClassDefinition = TypeDefinition.create(JavaType.void);
        if (api.result)
        {
            if (api.result instanceof AjaxResultTypeDefinition)
            {
                resultType = castAjaxResultTypeDefinitionToClassDefinition(api.result);
            }
            if (api.result instanceof TableDataInfoTypeDefinition)
            {
                resultType = castTableDataInfoTypeDefinitionToClassDefinition(api.result);
            }
        }
        const methodDefinition = new MethodDefinition(api.apiName, resultType);
        methodDefinition.addAnnotation(ControllerGenerator.buildRequestMappingAnnotation(api.method,api.url));
        if (api.params) {
            const paramDefinition = ModuleUtils.buildParams(api.params);
            if (paramDefinition)
            {
                if(api.method === RequestMethod.POST || api.method === RequestMethod.PUT)
                    paramDefinition?.addAnnotation(SpringAnnotationDefinitions.RequestBody);
                methodDefinition.addParameter(paramDefinition);
            }
        }
        return methodDefinition;
    }

    /**
     * 构建RequestMapping注解
     * @param method
     * @param path
     * @private
     */
    private static buildRequestMappingAnnotation(method: RequestMethod,path:string) {
        switch (method) {
            case RequestMethod.GET:
                return SpringAnnotationDefinitions.GetMapping(path);
            case RequestMethod.POST:
                return SpringAnnotationDefinitions.PostMapping(path);
            case RequestMethod.PUT:
                return SpringAnnotationDefinitions.PutMapping(path);
            case RequestMethod.DELETE:
                return SpringAnnotationDefinitions.DeleteMapping(path);
        }
    }

    /**
     * 创建java文件并写入内容
     * @param packageName
     * @param content
     * @param moduleName
     * @private
     */
    private static writeFile(packageName: string, content:string, moduleName: string) {
        const path = `${config.baseDir}\\${config.projectName}\\${packageName.replace(/\./g, '\\')}`;
        if (!exist(path))
            mkdirs(path);
        const file = `${path}\\${moduleName}.java`;
        writeStringToFile(file, content);

    }

    /**
     * 生成入参DTO
     * @param module
     * @private
     */
    private static generateParamDTOs(module: ModuleDefinition) {
        module.apis?.forEach(api => {
            if (api.params) {
                if (api.params.type instanceof ObjectTypeDefinition)
                    DTOGenerator.generate(api.params.type);
            }
        });
    }
}