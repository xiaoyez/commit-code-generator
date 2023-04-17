import {ApiDefinition} from "./ApiDefinition";

interface IModuleDefinition {
    /**
     * 模块名称。 如果是文件，就是文件名，否则是文件夹名
     */
    moduleName: string;

    /**
     * 公共url头
     */
    baseUrlPrefix: string;

    /**
     * 是否对应一个文件
     */
    isFile?: boolean;

    /**
     * 父模块
     */
    parent?: IModuleDefinition;

    /**
     * api列表
     */
    apis?: ApiDefinition[];
}

export class ModuleDefinition implements IModuleDefinition {
    moduleName!: string;
    baseUrlPrefix!: string;
    isFile?: boolean;
    parent?: IModuleDefinition;

    apis: ApiDefinition[] = [];

    constructor(props: IModuleDefinition) {
        Object.assign(this, props);
    }

    addApi(api: ApiDefinition) {
        this.apis.push(api);
    }
}