import {ObjectTypeDefinition} from "../../dto/definition/TypeDefinition";
import {ApiDefinition} from "../definition/ApiDefinition";
import {JavaType} from "../../dto/definition/JavaType";

export class ApiUtils {
    /**
     * 获取api的返参类型
     * @param api
     */
    static getResultDataType(api: ApiDefinition) {
        let dataType = null;
        if (api.result?.genericTypes)
            dataType = api.result.genericTypes[0];
        if (dataType) {
            if (dataType.type === JavaType.List) {
                dataType = dataType.genericTypes![0];
            }
        }
        return dataType;
    }

    /**
     * 获取api的返参类型字符串
     * @param api
     */
    static getResultDataTypeName(api: ApiDefinition) {
        let dataType = ApiUtils.getResultDataType(api);
        let dataTypeName = '';
        if (dataType && dataType.type instanceof ObjectTypeDefinition)
            dataTypeName = dataType.type.className;
        return dataTypeName;
    }
}