import {ObjectTypeDefinition} from "../api/definition/TypeDefinition";
import {JavaType} from "../api/definition/JavaType";
import {DTOGenerator} from "../api/generator/DTOGenerator";


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
DTOGenerator.generate(objectTypeDefinition);