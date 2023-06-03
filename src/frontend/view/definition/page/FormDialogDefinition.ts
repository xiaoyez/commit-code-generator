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
    fileName: string;
    packageName?: string;
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
    rule?: Rule;
    disabledInEdit?: boolean;
    labelKey?: string;
}

export class Rule {
    required: boolean;
    message?: string;
    trigger: string;
    pattern?: string;
    patternMessage?: string;

    constructor(message?: string, required: boolean = true, pattern?: string, patternMsg?: string, trigger: string = 'blur') {
        this.required = required;
        this.message = message;
        this.trigger = trigger;
        this.pattern = pattern;
        this.patternMessage = patternMsg;
    }

    static create(property: IPropertyDefinition, pattern?: string, patternMsg?: string) {
        let message;
        if (property.paramType.type === JavaType.Integer) {
            message = '请选择' + property.paramDesc;
        } else {
            message = property.paramDesc + '不能为空';
        }
        return new Rule(message, true, pattern, patternMsg);
    }

    static createNotRequired(pattern: string, patternMsg: string) {
        return new Rule(void 0, false, pattern, patternMsg);
    }

    static get idCardRule() {
        return new Rule('身份证号不能为空', true, '`RegexLib`.idCard', '请输入真实身份证号');
    }

    static get phoneNumberRule() {
        return new Rule('手机号不能为空', true, 'RegexLib.phoneNumber', '请输入真实手机号');
    }
}