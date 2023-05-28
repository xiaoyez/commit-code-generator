import {DataEnum} from "../definition/DataEnum";
import {saveToPath} from "../../utils/TSPathUtils";
import {compileEjsTmp} from "../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../ejsTmp/EjsTmp";

/**
 * 生成单个Enum定义
 * @param def
 */
export function generateSingleEnumDefine(def: DataEnum) {
    return compileEjsTmp(ejsTmp.tsEnumGenTmp, def);
}

/**
 * 生成Enum定义的ts文件的内容
 * @param defs
 */
export function generateEnumModuleDefine(defs: DataEnum[]) {
    return compileEjsTmp(ejsTmp.tsEnumModuleTmp, defs);
}

/**
 * 生成定义Enum和常量定义的ts文件
 * @param defs 需保证所有定义的package相同
 * @param subPath 子项目根路径
 * @param genIndex 是否生成为index.ts
 */
export function generateEnumDefsToFile(defs: DataEnum[], subPath = "", genIndex = false) {
    if (!defs || defs.length === 0) {
        return;
    }

    let content = generateEnumModuleDefine(defs);

    saveToPath(content, defs[0].package, subPath, genIndex);
}