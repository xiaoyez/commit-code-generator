import {ObjectTypeDefinition} from "../definition/TypeDefinition";
import {saveToPath} from "../../utils/TSPathUtils";
import {emptyImportLines, generateImportLines, getTypeUsingImports} from "../../utils/TSImportUtils";
import {compileEjsTmp} from "../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../ejsTmp/EjsTmp";


export function generateInterfaceDefine(def: ObjectTypeDefinition) {
    return compileEjsTmp(ejsTmp.tsInterfaceGenTmp, def);
}

export function generateInterfaceDefsToFile(defs: ObjectTypeDefinition[], subPath = "/src", genIndex = false) {
    if (!defs || defs.length === 0) {
        return;
    }

    let imports = emptyImportLines();
    let interfaces = defs.map(def => {
        getTypeUsingImports(def, imports);
        return generateInterfaceDefine(def);
    });
    let content = generateImportLines(imports) + '\n' + interfaces.join('\n\n') + '\n';

    saveToPath(content, defs[0].packageName, subPath, genIndex);
}