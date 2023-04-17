import {ObjectTypeDefinition} from "../src/dto/definition/TypeDefinition";
import {JavaType} from "../src/dto/definition/JavaType";
import {DTOGenerator} from "../src/dto/generator/DTOGenerator";


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

