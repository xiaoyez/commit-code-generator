/**
 * 枚举类型的选项。
 */
export interface IDataEnumOption {
    /**
     * 枚举类型的存储值
     */
    value: number;
    /**
     * 枚举值对应的标识符。
     */
    sign: string;
    /**
     * 枚举值对应的描述。
     */
    description: string;
}

/**
 * 枚举类型的选项。
 */
export class DataEnumOption implements IDataEnumOption {
    /**
     * 枚举类型的存储值
     */
    value!: number;
    /**
     * 枚举值对应的标识符。
     */
    sign!: string;
    /**
     * 枚举值对应的描述。
     */
    description!: string;

    constructor(props: IDataEnumOption) {
        Object.assign(this, props);
    }
}