import {readFile} from "../src/utils/FileUtils";
import {forEach, template} from "lodash";
import {ObjectTypeDefinition} from "../src/dto/definition/TypeDefinition";
import {JavaType} from "../src/dto/definition/JavaType";
import {DTOGenerator} from "../src/dto/generator/DTOGenerator";
import {JavaGeneratorUtils} from "../src/java/generator/utils/JavaGeneratorUtils";
import {ClassGenerator} from "../src/java/generator/ClassGenerator";
import {userController} from "./ControllerGenerator.test";
import {ControllerGenerator} from "../src/api/generator/ControllerGenerator";
import {ModuleUtils} from "../src/api/utils/ModuleUtils";


test('test ejs', function (){
    const objectTypeDefinition = new ObjectTypeDefinition({
        className: "AddFriendsDTO",
        packageName: "com.cgmanage.web.modules.ypx.domain.DTO",
        properties: [
            {
                paramName: "memberId",
                paramType: {
                    type: JavaType.Integer,
                },
                paramDesc: "id"
            },
            {
                paramName: "friends",
                paramType: {
                    type: JavaType.List,
                    genericTypes: [{
                        type: JavaType.Integer
                    }]
                },
                paramDesc: "好友id"
            }
        ]

    })
    const def = DTOGenerator.castToClassDefinition(objectTypeDefinition);
    ClassGenerator.buildImports(def)
    const filePath = 'C:\\softwares\\work\\code\\html\\code-generate\\src\\ejsTmp\\backend\\ClassTemplate.ejs'
    const tmp = readFile(filePath);
    console.log(template(tmp,{'imports':{
        forEach,
        JavaGeneratorUtils
        }})(ControllerGenerator.castToClassDefinition(ModuleUtils.buildPackageName(userController)+ '.controller',userController)))
})