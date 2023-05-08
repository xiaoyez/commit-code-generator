import {ModuleDefinition} from "./ModuleDefinition";
import {TypeDefinition} from "../../dto/definition/TypeDefinition";
import {RequestMethod} from "./RequestMethod";

/**
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
    params?: TypeDefinition;

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
    params?: TypeDefinition;
    result?: TypeDefinition;
    module?: ModuleDefinition;
    comment?: string;

    constructor(props: IApiDefinition) {
        Object.assign(this, props);
    }

    static create(apiName: string, url: string, method: RequestMethod, comment?:string, params?: TypeDefinition, result?: TypeDefinition) {
        return new ApiDefinition({apiName, url, method, params, result,comment});
    }
}