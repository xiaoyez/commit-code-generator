import {ModuleDefinition} from "../../src/api/definition/ModuleDefinition";
import {ApiDefinition} from "../../src/api/definition/ApiDefinition";
import {RequestMethod} from "../../src/api/definition/RequestMethod";
import {TableDataInfoTypeDefinition} from "../../src/api/definition/TableDataInfoTypeDefinition";
import {ObjectTypeDefinitionUtils} from "../../src/dto/definition/ObjectTypeDefinitionUtils";
import {tableUserDefinition} from "../db/DDLSqlGenerator.test";
import {ObjectTypeDefinition, TypeDefinition} from "../../src/dto/definition/TypeDefinition";
import {JavaType} from "../../src/dto/definition/JavaType";
import {AjaxResultTypeDefinition} from "../../src/api/definition/AjaxResultTypeDefinition";
import {generateTsApiFileModule, generateTsApiFunc} from "../../src/api/generator/TSApiCallGenerator";
import {ModuleUtils} from "../../src/api/utils/ModuleUtils";
import {config} from "../../src/config/Config";

describe('api call script', () => {
    const demoModule = new ModuleDefinition({
        baseUrlPrefix: "/demo", moduleName: "demo"

    })

    const userModule = new ModuleDefinition({
        baseUrlPrefix: "/user", moduleName: "user", parent: demoModule
    });

    const userApi = new ModuleDefinition({
        baseUrlPrefix: "/user", moduleName: "user", parent: userModule, isFile: true
    });

    let dtoPack = `${config.projectPackage}.${config.dtoPackage}`;
    let userDtoPack = `${dtoPack}.user`;

    let UserDTOType = ObjectTypeDefinitionUtils.castTableCreateDefinitionToObjectTypeDefinition(tableUserDefinition);
    UserDTOType.packageName = userDtoPack;

    userApi.addApi(new ApiDefinition({
        apiName: "listUser",
        url: "/listUser",
        method: RequestMethod.GET,
        module: userApi,
        result: TableDataInfoTypeDefinition.createTableDataInfo(UserDTOType),
        params: TypeDefinition.create(
            ObjectTypeDefinition.create("UserSearchDTO", userDtoPack, [
                {
                    paramName: "name",
                    paramType: TypeDefinition.create(JavaType.String),
                    paramDesc: "姓名"
                },
                {
                    paramName: "status",
                    paramType: TypeDefinition.create(JavaType.Integer),
                    paramDesc: "状态"
                },
            ])
        )
    }));

    userApi.addApi(new ApiDefinition({
        apiName: "addUser",
        url: "/addUser",
        method: RequestMethod.POST,
        module: userApi,
        result: AjaxResultTypeDefinition.createAjax(),
        params: TypeDefinition.create(ObjectTypeDefinition.create("UserAddDTO", userDtoPack, [
            {
                paramName: "name",
                paramType: TypeDefinition.create(JavaType.String),
                paramDesc: "姓名"
            },
        ]))

    }));

    it('generate api call func', function () {
        let prefix = ModuleUtils.buildBaseUrlPrefix(userApi);
        console.log(generateTsApiFunc(userApi.apis[0], prefix));
    });

    it('generate api module to file', function () {
        generateTsApiFileModule(userApi);
    });
});