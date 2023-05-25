import {ModuleDefinition} from "../src/api/definition/ModuleDefinition";
import {config} from "../src/config/Config";
import {DataEnum} from "../src/db/definition/DataEnum";
import {DataEnumOption} from "../src/db/definition/DataEnumOption";
import {ObjectTypeDefinition, TypeDefinition} from "../src/dto/definition/TypeDefinition";
import {JavaType} from "../src/dto/definition/JavaType";
import {TableCreateDefinition} from "../src/db/definition/TableCreateDefinition";
import {DataColumnDefinition} from "../src/db/definition/DataColumnDefinition";
import {SqlType} from "../src/db/definition/SqlType";
import {ObjectTypeDefinitionUtils} from "../src/dto/definition/ObjectTypeDefinitionUtils";
import {ApiDefinition} from "../src/api/definition/ApiDefinition";
import {RequestMethod} from "../src/api/definition/RequestMethod";
import {TableDataInfoTypeDefinition} from "../src/api/definition/TableDataInfoTypeDefinition";
import {FilterDefinition} from "../src/frontend/view/definition/page/FilterDefinition";
import {ViewUtils} from "../src/frontend/view/definition/page/ViewUtils";
import {
    ActBtn,
    TableColType,
    TableDefinition,
    TableViewDefinition
} from "../src/frontend/view/definition/page/TableViewDefinition";
import {cloneDeep} from "lodash";

const rootModule = new ModuleDefinition({
    baseUrlPrefix: `/${config.projectName}`, moduleName: config.projectName
})

export const userApiModuleDef = new ModuleDefinition({
    baseUrlPrefix: "/member", moduleName: "member", parent: rootModule, isFile: true
});

let dtoPack = `${config.basePackage}.${config.dtoPackage}`;
let memberDtoPack = `${dtoPack}.member`;

export const memberStatusEnumDef = new DataEnum({
    name: "MemberStatusConstant",
    package: `${config.basePackage}.${config.constantPackage}.member`,
    comment: "会员类型",
    options: [
        new DataEnumOption({
            description: "普通会员",
            sign: "NORMAL",
            value: 1
        }),
        new DataEnumOption({
            description: "公海会员",
            sign: "PUB_SEA",
            value: 2
        }),
        new DataEnumOption({
            description: "无效会员",
            sign: "INVALID",
            value: 3
        }),
    ],
    ruoyiDict: "ypx_member_status",
})

export const auditStatusEnumDef = DataEnum.createCommon(
    "AuditStatusConstant",
    [
        new DataEnumOption({
            description: "审核中",
            sign: "AUDITING",
            value: 1
        }),
        new DataEnumOption({
            description: "通过",
            sign: "PASS",
            value: 2
        }), new DataEnumOption({
        description: "拒绝",
        sign: "REJECT",
        value: 3
    }),
    ],
    "审核状态",
    "test_audit_status",
);

export const reqMemberListDef = TypeDefinition.create(
    ObjectTypeDefinition.create("MemberSearchDTO", memberDtoPack, [
        {
            paramName: "name",
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: "姓名"
        },
        {
            paramName: "status",
            paramType: TypeDefinition.create(JavaType.Integer),
            enumType: memberStatusEnumDef,
            paramDesc: "状态"
        },
    ])
)

//
// status: MemberStatus;

export const tbMemberTableDef = new TableCreateDefinition({
    tableName: "tb_member",
    comment: "会员表",
    columns: {
        id: new DataColumnDefinition({
            isEnum: false,
            name: "id",
            nullable: false,
            typeName: SqlType.INT,
            length: 11,
            comment: '主键',
            isPrimaryKey: true,
            autoIncrement: true,
        }),
        realName: new DataColumnDefinition({
            name: "real_name",
            nullable: false,
            typeName: SqlType.VARCHAR,
            length: 20,
            comment: '会员姓名',
        }),
        idCardNum: new DataColumnDefinition({
            name: "id_card_num",
            nullable: false,
            typeName: SqlType.VARCHAR,
            length: 18,
            comment: '会员身份证',
        }),
        avatar: new DataColumnDefinition({
            name: "avatar",
            nullable: true,
            typeName: SqlType.VARCHAR,
            length: 200,
            comment: '会员头像',
        }),
        status: new DataColumnDefinition({
            isEnum: true,
            name: "status",
            nullable: false,
            typeName: SqlType.INT,
            length: 1,
            comment: '会员类型',
            enumType: memberStatusEnumDef,
        }),
    },
});

export let memberDomainDef = ObjectTypeDefinitionUtils.castTableCreateDefinitionToDomainTypeDefinition(tbMemberTableDef);

export let memberClientDomainDef = cloneDeep(memberDomainDef) as ObjectTypeDefinition;
memberClientDomainDef.className = "MemberInfo";
memberClientDomainDef.packageName = memberDtoPack;
memberClientDomainDef.comment = "会员信息";
memberClientDomainDef.properties.push(
    {paramName: "deptName", paramDesc: "所属门店", paramType: {type: JavaType.String}},
    {paramName: "salesmanNickName", paramDesc: "所属业务员", paramType: {type: JavaType.String}},
)

export let queryMemberApiDef = new ApiDefinition({
    apiName: "listMember",
    comment: "请求会员列表",
    method: RequestMethod.GET,
    module: userApiModuleDef,
    params: reqMemberListDef,
    result: TableDataInfoTypeDefinition.createTableDataInfo(memberClientDomainDef),
    url: "/list"
});

export const memberFilterViewDef: FilterDefinition = {
    api: queryMemberApiDef,
    fileName: "",
    filterFormDefinition: ViewUtils.castApiDefinitionToFilterFormDefinition(queryMemberApiDef),
};

export const memberTableViewDef: TableViewDefinition = {
    actBtnArr: [ActBtn.ADD, ActBtn.EDIT, ActBtn.REMOVE, ActBtn.EXPORT],
    tableDef: new TableDefinition([
        // TODO: 写个工具函数来转换
        {label: "会员身份证", prop: "idCardNum", type: TableColType.TEXT, width: "120px", align: "center"},
        {label: "所属门店", prop: "deptName", type: TableColType.TEXT},
        {label: "所属业务员", prop: "salesmanNickName", type: TableColType.TEXT},
        {label: "会员头像", prop: "avatar", type: TableColType.IMG, align: "center"},
        {label: "会员类型", prop: "status", type: TableColType.DICT, dictName: "ypx_member_type", align: "center"},
    ], queryMemberApiDef, "memberList", true),
}