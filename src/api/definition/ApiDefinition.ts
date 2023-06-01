import {ModuleDefinition} from "./ModuleDefinition";
import {ObjectTypeDefinition, TypeDefinition} from "../../dto/definition/TypeDefinition";
import {RequestMethod} from "./RequestMethod";
import {ParameterDefinition} from "../../java/definition/ParameterDefinition";
import {lowerFirst} from "lodash";

/**
 * Api定义
 * R 为出参类型
 */
interface IApiDefinition {
    /**
     * 接口名称。
     */
    apiName: string;

    /**
     * 接口描述
     */
    comment?: string;

    /**
     * url
     */
    url: string;

    /**
     * 请求方式
     */
    method: RequestMethod;

    /**
     * 入参
     */
    params?: ParameterDefinition;

    /**
     * 返参
     */
    result?: TypeDefinition;

    /**
     * 父模块
     */
    module?: ModuleDefinition;
}

export class ApiDefinition implements IApiDefinition {
    apiName!: string;
    url!: string;
    method!: RequestMethod;
    params?: ParameterDefinition;
    result?: TypeDefinition;
    module?: ModuleDefinition;
    comment?: string;

    constructor(props: IApiDefinition) {
        Object.assign(this, props);
    }

    static create(apiName: string, url: string, method: RequestMethod, comment?:string, params?: TypeDefinition|ParameterDefinition, result?: TypeDefinition) {
        let parameter : ParameterDefinition | undefined ;
        if (params instanceof TypeDefinition)
        {
            parameter = new ParameterDefinition(lowerFirst((params.type as ObjectTypeDefinition).className),params);
        }
        else
            parameter = params;
        return new ApiDefinition({apiName, url, method, params: parameter, result,comment});
    }
}