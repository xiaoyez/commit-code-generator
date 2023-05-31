import {ApiDefinition} from "../../src/api/definition/ApiDefinition";
import {RequestMethod} from "../../src/api/definition/RequestMethod";
import {ModuleDefinition} from "../../src/api/definition/ModuleDefinition";
import {config} from "../../src/config/Config";

const rootModule = new ModuleDefinition({
    baseUrlPrefix: `/${config.projectName}`, moduleName: config.projectName
})

export const TbMemberController = new ModuleDefinition({
    baseUrlPrefix: "/member", isFile: true, moduleName: "member", parent: rootModule
})

export const getMemberListApi = new ApiDefinition({
    apiName: "getMemberList",
    comment: "获取分页会员列表",
    method: RequestMethod.GET,
    module: TbMemberController,
    params: undefined,
    result: undefined,
    url: ""
})