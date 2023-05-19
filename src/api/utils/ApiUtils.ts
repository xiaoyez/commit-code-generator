import {ObjectTypeDefinition} from "../../dto/definition/TypeDefinition";
import {ApiDefinition} from "../definition/ApiDefinition";

export class ApiUtils {
    static getResultTypeName(api: ApiDefinition) {
        let dataType = null;
        let dataTypeName = '';
        if (api.result?.genericTypes)
            dataType = api.result.genericTypes[0];
        if (dataType && dataType.type instanceof ObjectTypeDefinition)
            dataTypeName = dataType.type.className;
        return dataTypeName;
    }
}