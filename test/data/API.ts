import {ApiDefinition} from "../../src/api/definition/ApiDefinition";
import {RequestMethod} from "../../src/api/definition/RequestMethod";
import {ModuleDefinition} from "../../src/api/definition/ModuleDefinition";
import {TableDataInfoTypeDefinition} from "../../src/api/definition/TableDataInfoTypeDefinition";
import {TbMemberAddDTODef, tbMemberDomainTypeDef, TbMemberEditDTODef, TbMemberSearchDTODef} from "./DTO";
import {AjaxResultTypeDefinition} from "../../src/api/definition/AjaxResultTypeDefinition";
import {ParameterDefinition} from "../../src/java/definition/ParameterDefinition";

export const TbMemberController = new ModuleDefinition({
    baseUrlPrefix: "/test/member", isFile: true, moduleName: "TbMemberController",comment:"会员管理Controller"
})

export const getMemberListApi = new ApiDefinition({
    apiName: "getMemberList",
    comment: "获取分页会员列表",
    method: RequestMethod.GET,
    module: TbMemberController,
    params: ParameterDefinition.create(TbMemberSearchDTODef),
    result: TableDataInfoTypeDefinition.createTableDataInfo(tbMemberDomainTypeDef),
    url: "/list"
})

export const addMemberApi = new ApiDefinition({
    apiName: "addMember",
    comment: "添加会员",
    method: RequestMethod.POST,
    module: TbMemberController,
    params: ParameterDefinition.create(TbMemberAddDTODef),
    result: AjaxResultTypeDefinition.createAjax(),
    url: ''
});

export const editMemberApi = new ApiDefinition({
    apiName: "editMember",
    comment: "编辑会员",
    method: RequestMethod.PUT,
    module: TbMemberController,
    params: ParameterDefinition.create(TbMemberEditDTODef),
    result: AjaxResultTypeDefinition.createAjax(),
    url: ''
});

TbMemberController.addApi(getMemberListApi);
TbMemberController.addApi(addMemberApi);
TbMemberController.addApi(editMemberApi);

