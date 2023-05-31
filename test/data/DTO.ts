import {ObjectTypeDefinitionUtils} from "../../src/dto/definition/ObjectTypeDefinitionUtils";
import {sysDeptTableDef, sysUserTableDef, tbMemberTableDef} from "./DbData";
import {ObjectTypeDefinition, TypeDefinition} from "../../src/dto/definition/TypeDefinition";
import {JavaType} from "../../src/dto/definition/JavaType";
import {MemberLabelEnumDef, MemberStatusEnumDef} from "./enums";
import {TimePattern} from "../../src/dto/definition/TimePattern";
import {omit} from "lodash";

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
            paramDesc: '所属部门',
            foreignKey: true,
            referenceTable: sysDeptTableDef,
            referenceColumn: sysDeptTableDef.columns.deptId,
        },
        {
            paramName: 'userId',
            paramType: TypeDefinition.create(JavaType.Integer),
            paramDesc: '所属用户',
            foreignKey: true,
            referenceTable: sysUserTableDef,
            referenceColumn: sysUserTableDef.columns.userId,
        },
        {
            paramName: 'status',
            paramType: TypeDefinition.create(JavaType.Integer),
            paramDesc: '会员状态',
            enumType: MemberStatusEnumDef,
        },
        {
            paramName: 'label',
            paramType: TypeDefinition.create(JavaType.Integer),
            paramDesc: '会员标签',
            enumType: MemberLabelEnumDef,
        },

    ],

}));

export const TbMemberAddDTODef = TypeDefinition.create(new ObjectTypeDefinition({
    className: "TbMemberAddDTO",
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
            paramName: 'gender',
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: '性别'
        },
        {
            paramName: 'avatar',
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: '头像'
        },
        {
            paramName: 'phoneNum',
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: '会员手机号'
        },
        {
            paramName: 'birthday',
            paramType: TypeDefinition.create(JavaType.Date),
            paramDesc: '生日',
            timePattern: TimePattern.DATE
        },
        {
            paramName: 'description',
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: '会员描述'
        },
        {
            paramName: 'remark',
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: '备注',
        },
        {
            paramName: 'deptId',
            paramType: TypeDefinition.create(JavaType.Integer),
            paramDesc: '所属部门',
            foreignKey: true,
            referenceTable: sysDeptTableDef,
            referenceColumn: sysDeptTableDef.columns.deptId,
        },
        {
            paramName: 'userId',
            paramType: TypeDefinition.create(JavaType.Integer),
            paramDesc: '所属用户',
            foreignKey: true,
            referenceTable: sysUserTableDef,
            referenceColumn: sysUserTableDef.columns.userId,
        },
        {
            paramName: 'introduceMemberId',
            paramType: TypeDefinition.create(JavaType.Integer),
            paramDesc: '介绍人ID',
            foreignKey: true,
            referenceTable: tbMemberTableDef,
            referenceColumn: tbMemberTableDef.columns.id,
        },
        {
            paramName: 'label',
            paramType: TypeDefinition.create(JavaType.Integer),
            paramDesc: '会员标签',
            enumType: MemberLabelEnumDef,
        },
        {
            paramName: 'belongMe',
            paramType: TypeDefinition.create(JavaType.Boolean),
            paramDesc: '是否属于我',
        }
    ],
}));

export const TbMemberEditDTODef = TypeDefinition.create(new ObjectTypeDefinition({
    className: "TbMemberEditDTO",
    properties: [
        {
            paramName: 'id',
            paramType: TypeDefinition.create(JavaType.Integer),
            paramDesc: '会员ID',
        },
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
            paramName: 'gender',
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: '性别'
        },
        {
            paramName: 'avatar',
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: '头像'
        },
        {
            paramName: 'phoneNum',
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: '会员手机号'
        },
        {
            paramName: 'birthday',
            paramType: TypeDefinition.create(JavaType.Date),
            paramDesc: '生日',
            timePattern: TimePattern.DATE
        },
        {
            paramName: 'description',
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: '会员描述'
        },
        {
            paramName: 'remark',
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: '备注',
        },
        {
            paramName: 'introduceMemberId',
            paramType: TypeDefinition.create(JavaType.Integer),
            paramDesc: '介绍人ID',
            foreignKey: true,
            referenceTable: tbMemberTableDef,
            referenceColumn: tbMemberTableDef.columns.id,
        },
        {
            paramName: 'label',
            paramType: TypeDefinition.create(JavaType.Integer),
            paramDesc: '会员标签',
            enumType: MemberLabelEnumDef,
        },
    ]

}));