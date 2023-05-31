import {ObjectTypeDefinitionUtils} from "../../src/dto/definition/ObjectTypeDefinitionUtils";
import {tbMemberTableDef} from "./DbData";
import {ObjectTypeDefinition, TypeDefinition} from "../../src/dto/definition/TypeDefinition";
import {JavaType} from "../../src/dto/definition/JavaType";
import {MemberStatus} from "./enums";

/**
 * 会员表对应的实体类的定义
 */
export const tbMemberDomainTypeDef = ObjectTypeDefinitionUtils.castTableCreateDefinitionToDomainTypeDefinition(tbMemberTableDef);

export const TbMemberSearchDTODef = TypeDefinition.create(new ObjectTypeDefinition({
    className: "TbMemberSearchDTO",
    properties: [
        {
            paramName: 'realName',
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: '会员姓名'
        },
        {
            paramName: 'idCardNum',
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: '身份证号'
        },
        {
            paramName: 'memberNum',
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: '会员编号'
        },
        {
            paramName: 'phoneNum',
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: '会员手机号'
        },
        {
            paramName: 'deptId',
            paramType: TypeDefinition.create(JavaType.Integer),
            paramDesc: '所属部门'
        },
        {
            paramName: 'userId',
            paramType: TypeDefinition.create(JavaType.Integer),
            paramDesc: '所属用户'
        },
        {
            paramName: 'status',
            paramType: TypeDefinition.create(JavaType.Integer),
            paramDesc: '会员状态',
            enumType: MemberStatus,
        },
        {
            paramName: 'label',
            paramType: TypeDefinition.create(JavaType.Integer),
            paramDesc: '会员标签'
        },

    ],

}))