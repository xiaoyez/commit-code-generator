import {ObjectTypeDefinition} from "../definition/TypeDefinition";
import {saveToPath} from "../../utils/TSPathUtils";
import {compileEjsTmp} from "../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../ejsTmp/EjsTmp";
import {getInterfaceModuleImportLines} from "../../utils/TSImportUtils";
import {getFullPackageName, PackageType} from "../../utils/PackageUtils";

/**
 * 生成单个Interface定义
 * @param def
 */
export function generateInterfaceDefine(def: ObjectTypeDefinition) {
    return compileEjsTmp(ejsTmp.tsInterfaceGenTmp, def);
}

/**
 * 生成Interface定义的ts文件的内容
 * @param defs
 */
export function generateInterfaceModuleDefine(defs: ObjectTypeDefinition[]) {
    return compileEjsTmp(ejsTmp.tsInterfaceModuleTmp, {
        defs, importLines: getInterfaceModuleImportLines(defs),
    });
}

/*
 * 生成定义Interface的ts文件
 * @param defs
 * @param genIndex
 */
export function generateInterfaceDefsToFile(defs: ObjectTypeDefinition[], genIndex = false) {
    if (!defs || defs.length === 0) {
        return;
    }

    const content = generateInterfaceModuleDefine(defs);
    const fullPackageName = getFullPackageName(PackageType.DTO, defs[0].packageName)

    saveToPath(content, fullPackageName, !defs[0].packageName);
}