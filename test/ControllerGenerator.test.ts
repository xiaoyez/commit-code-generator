import {ModuleDefinition} from "../src/api/definition/ModuleDefinition";
import {ApiDefinition} from "../src/api/definition/ApiDefinition";
import {RequestMethod} from "../src/api/definition/RequestMethod";
import {TableDataInfoTypeDefinition} from "../src/api/definition/TableDataInfoTypeDefinition";
import {tableUserDefinition} from "./DDLSqlGenerator.test";
import {ObjectTypeDefinitionUtils} from "../src/dto/definition/ObjectTypeDefinitionUtils";
import {ObjectTypeDefinition, TypeDefinition} from "../src/dto/definition/TypeDefinition";
import {JavaType} from "../src/dto/definition/JavaType";
import {ControllerGenerator} from "../src/api/generator/ControllerGenerator";
import {AjaxResultTypeDefinition} from "../src/api/definition/AjaxResultTypeDefinition";
import {singular} from "../src/utils/StringUtils";

const ypxModule = new ModuleDefinition({
    baseUrlPrefix: "/ypx", moduleName: "ypx"

})

const userModule = new ModuleDefinition({
    baseUrlPrefix: "/user", moduleName: "user", parent: ypxModule
});

const userController = new ModuleDefinition({
    baseUrlPrefix: "/user", moduleName: "UserController", parent: userModule, isFile: true
});


const listUserApi = new ApiDefinition({
    apiName: "listUser",
    url: "/listUser",
    method: RequestMethod.GET,
    module: userController,
    result: TableDataInfoTypeDefinition.createTableDataInfo(ObjectTypeDefinitionUtils.castTableCreateDefinitionToObjectTypeDefinition(tableUserDefinition)),
    params: TypeDefinition.create(
        ObjectTypeDefinition.create("UserSearchDTO", "dto", [
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
})

const addUserApi = new ApiDefinition({
    apiName: "addUser",
    url: "/addUser",
    method: RequestMethod.POST,
    module: userController,
    result: AjaxResultTypeDefinition.createAjax(),
    params: TypeDefinition.create(ObjectTypeDefinition.create("UserAddDTO", "dto", [
        {
            paramName: "name",
            paramType: TypeDefinition.create(JavaType.String),
            paramDesc: "姓名"
        },
    ]))

});

userController.addApi(listUserApi);
userController.addApi(addUserApi);

test("test controller buildMethod", () => {
    console.log(ControllerGenerator.buildMethod(listUserApi));
})

test("test controller generate", () => {
    ControllerGenerator.generate(userController)
})

test('singular', ()=>{
    console.log(singular('arrayList'))
})