import {ModuleDefinition} from "../definition/ModuleDefinition";
import {ObjectTypeDefinition, TypeDefinition} from "../../dto/definition/TypeDefinition";
import {lowerFirst} from "lodash";
import {ParameterDefinition} from "../../java/definition/ParameterDefinition";
import {getApiCallModuleImportLines} from "../../utils/TSImportUtils";

export class ModuleUtils {

    /**
     * 构建包名
     * @param module
     */
    static buildPackageName(module: ModuleDefinition) {
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

    /**
     * 构建url前缀
     * @param module
     */
    static buildBaseUrlPrefix(module: ModuleDefinition) {
        let baseUrlPrefix = module.baseUrlPrefix;
        let parent = module.parent;
        while (parent) {
            baseUrlPrefix = parent.baseUrlPrefix + baseUrlPrefix;
            parent = parent.parent;
        }
        return baseUrlPrefix;
    }

    /**
     * 构建方法参数
     * @param params
     */
    static buildParams(params: TypeDefinition | undefined) {
        if (!params) {
            return undefined;
        }
        return new ParameterDefinition(ModuleUtils.buildParamsName(params),TypeDefinition.create(params.type,params.genericTypes));
    }

    /**
     * 根据TypeDefiniton构建类型名称
     * @param type
     */
    static buildTypeNameByTypeDefinition(type: TypeDefinition | undefined) {
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
        typeName += ModuleUtils.buildGenericTypeText(type);
        return typeName;
    }

    /**
     * 构建泛型类型字符串
     * @param type
     */
    static buildGenericTypeText(type: TypeDefinition) {
        let genericTypeText = '';
        // 加泛型
        if (type.genericTypes && type.genericTypes.length > 0) {
            genericTypeText += '<';
            genericTypeText += type.genericTypes.map(type => ModuleUtils.buildTypeNameByTypeDefinition(type)).join(',');
            genericTypeText += '>';
        }
        return genericTypeText;
    }

    /**
     * 构建参数名
     * @param params
     */
    static buildParamsName(params: TypeDefinition | undefined) {
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

    /**
     * 前缀转模块名
     * @param prefix
     */
    static prefix2Module(prefix?: string) {
        if (!prefix) return '';
        let res = prefix.replace('\/', '.');
        return res.startsWith('.') ? res.substring(1) : res;
    }

    /**
     * 生成tsApiModule的ViewModel
     * @param modDef
     */
    static tsApiModuleViewModel(modDef: ModuleDefinition) {
        let importLines = getApiCallModuleImportLines(modDef);
        let { apis } = modDef;
        let urlPrefix = ModuleUtils.buildBaseUrlPrefix(modDef);
        return { importLines, apis, urlPrefix };
    }
}