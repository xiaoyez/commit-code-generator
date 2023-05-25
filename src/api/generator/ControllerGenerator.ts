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

export class ControllerGenerator {
    static generate(module: ModuleDefinition) {
        if(!module.isFile) {
            return;
        }
        const packageName = ModuleUtils.buildPackageName(module)+ '.controller';

        const controllerClassDefinition = ControllerGenerator.castToClassDefinition(packageName, module);

        // 创建java文件并写入内容
        ControllerGenerator.writeFile(packageName,ClassGenerator.generate(controllerClassDefinition),module.moduleName);
        // 生成入参java文件
        ControllerGenerator.generateParamDTOs(module);
    }

    static castToClassDefinition(packageName: string, module: ModuleDefinition) {
        const controllerClassDefinition = new ClassDefinition(packageName, module.moduleName);

        ControllerGenerator.addSpringAnnotations(controllerClassDefinition, module);

        ControllerGenerator.addServiceField(module, controllerClassDefinition);

        ControllerGenerator.buildMethods(module, controllerClassDefinition);
        return controllerClassDefinition;
    }

    private static buildMethods(module: ModuleDefinition, controllerClassDefinition: ClassDefinition) {
        const methods = module.apis?.map(api => ControllerGenerator.buildMethod(api));
        controllerClassDefinition.methods = methods;
    }

    private static addServiceField(module: ModuleDefinition, controllerClassDefinition: ClassDefinition) {
        const serviceName = lowerFirst(module.moduleName.replace('Controller', '')) + 'Service';
        const serviceFieldDefinition = new FieldDefinition(serviceName, ServiceGenerator.buildServiceInterfaceDefinition(module));
        serviceFieldDefinition.addAnnotation(SpringAnnotationDefinitions.Autowired);
        controllerClassDefinition.fields.push(serviceFieldDefinition);
    }

    private static addSpringAnnotations(controllerClassDefinition: ClassDefinition, module: ModuleDefinition) {
        // 添加注解
        controllerClassDefinition.addAnnotation(SpringAnnotationDefinitions.RestController);
        controllerClassDefinition.addAnnotation(SpringAnnotationDefinitions.RequestMapping(ModuleUtils.buildBaseUrlPrefix(module)));
    }

    private static addService(module: ModuleDefinition) {

        let text = '';
        text += `    @Autowired\n`;
        text += `    private I${module.moduleName.replace('Controller','')}Service ${lowerFirst(module.moduleName.replace('Controller',''))}Service;\n\n`;
        return text;

    }

    static buildMethod(api: ApiDefinition) {
        const resultType = api.result?TypeDefinition.create(api.result.type,api.result.genericTypes):TypeDefinition.create(JavaType.void);
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