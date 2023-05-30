import {ApiDefinition} from "../definition/ApiDefinition";
import {ModuleDefinition} from "../definition/ModuleDefinition";
import {ModuleUtils} from "../utils/ModuleUtils";
import {saveToPath} from "../../utils/TSPathUtils";
import {compileEjsTmp} from "../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../ejsTmp/EjsTmp";

/**
 * 生成ts的api调用函数
 * @param apiDef
 * @param baseUrl
 */
export function generateTsApiFunc(apiDef: ApiDefinition, baseUrl: string) {
    return compileEjsTmp(ejsTmp.tsApiCallFuncTmp, {
        api: apiDef, baseUrl,
    });
}

/**
 * 生成ts的api文件的内容
 * @param modDef
 */
export function generateTsApiModule(modDef: ModuleDefinition) {
    return compileEjsTmp(ejsTmp.tsApiModuleTmp, ModuleUtils.tsApiModuleViewModel(modDef));
}

/**
 * 生成ts的api文件
 * @param modDef
 * @param subPath
 * @param genIndex
 */
export function generateTsApiFileModule(modDef: ModuleDefinition, subPath = "", genIndex = false) {
    let content = generateTsApiModule(modDef);

    let packageName = ModuleUtils.buildPackageName(modDef);
    saveToPath(content, packageName, subPath, genIndex);
}