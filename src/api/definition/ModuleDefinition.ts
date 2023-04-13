interface IModuleDefinition {
    /**
     * 模块名称。
     */
    moduleName: string;

    /**
     * 公共url头
     */
    baseUrlPrefix: string;

    /**
     * 是否对应一个类
     */
    isClass?: boolean;

    /**
     * 父模块
     */
    parent?: IModuleDefinition;
}

export class ModuleDefinition implements IModuleDefinition {
    moduleName!: string;
    baseUrlPrefix!: string;
    isClass?: boolean;
    children?: IModuleDefinition[];

    constructor(props: IModuleDefinition) {
        Object.assign(this, props);
    }
}