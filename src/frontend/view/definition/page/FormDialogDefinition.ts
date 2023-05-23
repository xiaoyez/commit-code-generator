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

export interface DataFormDefinition extends FormDefinition {
    rules: Record<string, Rule>;
    fields: Record<string, DisplayType>
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