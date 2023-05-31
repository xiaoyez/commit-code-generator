import {ApiDefinition} from "../../src/api/definition/ApiDefinition";
import {RequestMethod} from "../../src/api/definition/RequestMethod";
import {ModuleDefinition} from "../../src/api/definition/ModuleDefinition";
import {config} from "../../src/config/Config";
import {TableDataInfoTypeDefinition} from "../../src/api/definition/TableDataInfoTypeDefinition";
import {tbMemberDomainTypeDef, TbMemberSearchDTODef} from "./DTO";

export const TbMemberController = new ModuleDefinition({
    baseUrlPrefix: "/test/member", isFile: true, moduleName: "member",comment:"会员管理Controller"
})

export const getMemberListApi = new ApiDefinition({
    apiName: "getMemberList",
    comment: "获取分页会员列表",
    method: RequestMethod.GET,
    module: TbMemberController,
    params: TbMemberSearchDTODef,
    result: TableDataInfoTypeDefinition.createTableDataInfo(tbMemberDomainTypeDef),
    url: "/list"
})

TbMemberController.addApi(getMemberListApi);