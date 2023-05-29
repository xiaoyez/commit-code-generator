import {ApiDefinition} from "../../../../api/definition/ApiDefinition";
import {IPropertyDefinition} from "../../../../dto/definition/TypeDefinition";
import {JavaType} from "../../../../dto/definition/JavaType";
import {FormDefinition, FormItemDefinition} from "./FormDefinition";

/**
 * Api
 * TypeDefinition(JavaType|ObjectTypeDefinition)
 * TableCreateDefinition/ViewCreateDefinition
 * DataColumnDefinition
 */

/**
 * 表单弹窗定义
 */
export interface FormDialogDefinition {
    // 新增数据的api
    addApi: ApiDefinition;
    // 修改数据的api
    editApi: ApiDefinition;
    // 查询数据详情的api
    infoApi: ApiDefinition;
    // 弹窗宽度
    width: string;
    formDefinition: DataFormDefinition;

}

/*
就修改而言:
弹窗首先要接收infoApi的返参，页面上并不显示infoApi返参的所有字段
然后根据editApi的入参，这个入参的所有字段是都要的
 */

/**
 * 弹窗表单项定义
 */
export interface DataFormItemDefinition extends FormItemDefinition {
    displayType: DisplayType;
    disabledInEdit?: boolean;
    rule: Rule;
}

/**
 * 弹窗表单定义
 */
export interface DataFormDefinition extends FormDefinition {
    items: DataFormItemDefinition[];
}

export interface DataFormFieldDefinition {
    displayType: DisplayType;
    rule: Rule;
    disabledInEdit?: boolean;
}

export enum DisplayType {
    ADD,EDIT,INFO
}


export class Rule {
    required: boolean;
    message: string;
    trigger: string;
    pattern?: string;

    constructor(message: string, required: boolean = true, pattern?: string, trigger: string = 'blur') {
        this.required = required;
        this.message = message;
        this.trigger = trigger;
        this.pattern = pattern;
    }

    static create(property: IPropertyDefinition)
    {
        let message = '';
        if (property.paramType.type === JavaType.String) {
            message = property.paramDesc + '不能为空';
        }
        if (property.paramType.type === JavaType.Integer) {
            message = '请选择' + property.paramDesc ;
        }
        return new Rule(message);
    }

    static idCardRule = new Rule('请输入真实身份证号',true, 'RegexLib.idCard');
    static phoneNumberRule = new Rule('请输入真实手机号',true, 'RegexLib.phoneNumber');
}