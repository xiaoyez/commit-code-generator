import {ApiDefinition} from "../definition/ApiDefinition";
import {ModuleDefinition} from "../definition/ModuleDefinition";
import {ModuleUtils} from "../utils/ModuleUtils";
import {controllerTsModuleId, saveToPath} from "../../utils/TSPathUtils";
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
export function generateTsApiModule(modDef: ModuleDefinition|ApiDefinition[]) {
    return compileEjsTmp(ejsTmp.tsApiModuleTmp, ModuleUtils.tsApiModuleViewModel(modDef));
}


/**
 * 生成ts的api文件(api/index.ts)
 * @param modDef 根模块中的api定义
 * @param genIndex
 */
export function generateTsApiFileModule(modDef: ApiDefinition[]): void;
/**
 * 生成ts的api文件
 * @param modDef
 * @param genIndex
 */
export function generateTsApiFileModule(modDef: ModuleDefinition, genIndex: boolean): void;
export function generateTsApiFileModule(modDef: ModuleDefinition|ApiDefinition[], genIndex = false) {
    let content = generateTsApiModule(modDef);
    saveToPath(content, controllerTsModuleId(Array.isArray(modDef) ? void 0 : modDef), genIndex);
}