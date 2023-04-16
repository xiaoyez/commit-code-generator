import {ModuleDefinition} from "./ModuleDefinition";
import {TypeDefinition} from "../../dto/definition/TypeDefinition";

/**
 * R 为出参类型
 */
interface IApiDefinition<R> {
    /**
     * 接口名称。
     */
    apiName: string;

    /**
     * url
     */
    url: string;

    /**
     * 请求方式
     */
    method: string;

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