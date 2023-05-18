import {ObjectTypeDefinitionUtils} from "../../../../dto/definition/ObjectTypeDefinitionUtils";
import {ObjectTypeDefinition} from "../../../../dto/definition/TypeDefinition";

interface ITopSearchItemDefinition {

    /** 标签 */
    label: string;

    placeholder: string;

    size?: string;

    type: SearchType;

    prop: string;
}

export enum SearchType {
    INPUT = 'input',
    SELECT = 'select',
    DATE = 'date',
}

interface ITopInputSearchItemDefinition extends ITopSearchItemDefinition {

}

interface ITopSelectSearchItemDefinition extends ITopSearchItemDefinition {
    /**
     *  要遍历的数组的元素的类型
     */
    iterArrayType: ObjectTypeDefinition;

    /**
     *  要遍历的数组名
     */
    iterArrayName: string;

    /**
     * 遍历数组的元素的变量名
     */
    iterVarName: string;

    /**
     * el-option的key属性
     */
    keyProp: string;

    /**
     * el-option的label属性
     */
    labelProp: string;

    /**
     * el-option的value属性
     */
    valueProp: string;

}

export class TopSearchItemDefinition implements ITopSearchItemDefinition{

    label!: string;
    placeholder!: string;
    prop!: string;
    size: string = 'small';
    type!: SearchType;

    constructor(prop: ITopSearchItemDefinition) {
        Object.assign(this, prop);
    }
}

export class TopInputSearchItemDefinition extends TopSearchItemDefinition implements ITopInputSearchItemDefinition {
    type = SearchType.INPUT;
    constructor(prop: ITopInputSearchItemDefinition) {
        super(prop);
    }

    static create(label: string, prop: string, placeholder: string = '请输入' + label, size: string = 'small') {
        return new TopInputSearchItemDefinition({
            label,
            prop,
            placeholder,
            size,
            type: SearchType.INPUT
        });
    }
}

export class TopSelectSearchItemDefinition extends TopSearchItemDefinition implements ITopSelectSearchItemDefinition {
    iterArrayType!: ObjectTypeDefinition;
    iterArrayName!: string;
    iterVarName!: string;
    keyProp!: string;
    labelProp!: string;
    valueProp!: string;

    constructor(prop: ITopSelectSearchItemDefinition) {
        super(prop);
        Object.assign(this, prop);
    }
}

export const sysDictData = ObjectTypeDefinition.create('SysDictData', 'com.ruoyi.common.core.domain.entity',[])

export class TopDictSelectSearchItemDefinition extends TopSelectSearchItemDefinition {
    type = SearchType.SELECT;
    keyProp = 'value';
    labelProp = 'label';
    valueProp = 'value';
    iterArrayType = sysDictData;

    constructor(prop: ITopSelectSearchItemDefinition) {
        super(prop);
    }

    static create(dictType: string, iterVarName: string, prop: ITopSearchItemDefinition ) {
        return new TopDictSelectSearchItemDefinition({
            ...prop,
            iterArrayName: dictType,
            iterArrayType: sysDictData,
            iterVarName: iterVarName,
            keyProp: "value",
            labelProp: "label",
            valueProp: "value"

        });
    }
}

interface ITopDateSearchItemDefinition extends ITopSearchItemDefinition {
    isRange: boolean;
    withTime: boolean;
    startPlaceholder?: string;
    endPlaceholder?: string;
    // 同时也是value-format
    format?: string;
    rangeSeparator?: string;
    model?: string;

}



