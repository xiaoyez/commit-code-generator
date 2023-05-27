import {ObjectTypeDefinition} from "../definition/TypeDefinition";
import {saveToPath} from "../../utils/TSPathUtils";
import {compileEjsTmp} from "../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../ejsTmp/EjsTmp";
import {getInterfaceModuleImportLines} from "../../utils/TSImportUtils";


export function generateInterfaceDefine(def: ObjectTypeDefinition) {
    return compileEjsTmp(ejsTmp.tsInterfaceGenTmp, def);
}

export function generateInterfaceModuleDefine(defs: ObjectTypeDefinition[]) {
    return compileEjsTmp(ejsTmp.tsInterfaceModuleTmp, {
        defs, importLines: getInterfaceModuleImportLines(defs),
    });
}

export function generateInterfaceDefsToFile(defs: ObjectTypeDefinition[], subPath = "/src", genIndex = false) {
    if (!defs || defs.length === 0) {
        return;
    }

    let content = generateInterfaceModuleDefine(defs);

    saveToPath(content, defs[0].packageName, subPath, genIndex);
}