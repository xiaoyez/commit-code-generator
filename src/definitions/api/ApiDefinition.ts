import {ModuleDefinition} from "./ModuleDefinition";
import {ObjectTypeDefinition} from "./ObjectTypeDefinition";

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
    params?: ObjectTypeDefinition;

    /**
     * 返参
     */
    result?: R;

    /**
     * 父模块
     */
    module?: ModuleDefinition;
}