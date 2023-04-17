import {ApiDefinition} from "../definition/ApiDefinition";
import {tsTypeString} from "../../utils/TypeUtils";

export function generateTsApiFunc(apiDef: ApiDefinition, baseUrl: string) {
    let paramStr = "";
    let reqInfo = [
        ['url', baseUrl + apiDef.url],
        ['method', apiDef.method],
    ];
    if (apiDef.params) {
        paramStr = `params:${tsTypeString(apiDef.params)}`;
        let paramKey = apiDef.method === 'get' ? 'params' : 'data';
        reqInfo.push([paramKey, 'params']);
    }
    let resultType = apiDef.result ? tsTypeString(apiDef.result) : 'void';
    return `export function ${apiDef.apiName}(${paramStr}): Promise<${resultType}> {
    return request({\n${
        reqInfo.map(([key, value]) => `        ${key}: ${value},`).join('\n')
    }
    });
}`
}