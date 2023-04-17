import {ApiDefinition} from "../definition/ApiDefinition";
import {tsTypeString} from "../../utils/TypeUtils";
import {ModuleDefinition} from "../definition/ModuleDefinition";
import {getTypeImportsFrom} from "../../dto/generator/TSInterfaceGenerator";
import {ModuleUtils} from "../utils/ModuleUtils";
import {saveToPath} from "../../utils/TSPathUtils";

export function generateTsApiFunc(apiDef: ApiDefinition, baseUrl: string) {
    let paramStr = "";
    let reqInfo = [
        ['url', `"${baseUrl + apiDef.url}"`],
        ['method', `"${apiDef.method}"`],
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

export function generateTsApiFileModule(modDef: ModuleDefinition, subPath = "", genIndex = false) {
    let imports = modDef.apis.reduce((importMap, apiDef) => {
        if (apiDef.params) {
            importMap = getTypeImportsFrom(apiDef.params, importMap);
        }

        if (apiDef.result) {
            importMap = getTypeImportsFrom(apiDef.result, importMap);
        }
        return importMap;
    }, new Map<string, Set<string>>());

    let importLines = [...imports.entries()].map(([path, names]) => {
        return `import {${[...names].join(', ')}} from "${path}";`;
    });
    importLines.unshift('import {request} from "@/utils/request";');

    let prefix = ModuleUtils.buildBaseUrlPrefix(modDef);
    let apiFuncs = modDef.apis.map(apiDef => generateTsApiFunc(apiDef, prefix));

    let content = importLines.join('\n') + '\n\n' + apiFuncs.join('\n\n') + '\n';
    let packageName = ModuleUtils.buildPackageName(modDef);

    saveToPath(content, packageName, subPath, genIndex);
}