import {ObjectTypeDefinition} from "../src/api/definition/TypeDefinition";
import {JavaType} from "../src/api/definition/JavaType";
import {DTOGenerator} from "../src/api/generator/DTOGenerator";


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
test('test generate',()=>{
    DTOGenerator.generate(objectTypeDefinition);
})