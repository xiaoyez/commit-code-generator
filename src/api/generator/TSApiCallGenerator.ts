import {ApiDefinition} from "../definition/ApiDefinition";
import {ModuleDefinition} from "../definition/ModuleDefinition";
import {addNewImport, emptyImportLines, generateImportLines, getTypeImportsFrom} from "../../utils/TSImportUtils";
import {ModuleUtils} from "../utils/ModuleUtils";
import {saveToPath} from "../../utils/TSPathUtils";
import {compileEjsTmp} from "../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../ejsTmp/EjsTmp";

export function generateTsApiFunc(apiDef: ApiDefinition, baseUrl: string) {
    return compileEjsTmp(ejsTmp.tsApiCallFuncTmp, {
        api: apiDef, baseUrl,
    });
}

export function generateTsApiModule(modDef: ModuleDefinition) {
    return compileEjsTmp(ejsTmp.tsApiModuleTmp, ModuleUtils.tsApiModuleViewModel(modDef));
}

export function generateTsApiFileModule(modDef: ModuleDefinition, subPath = "", genIndex = false) {
    let content = generateTsApiModule(modDef);

    let packageName = ModuleUtils.buildPackageName(modDef);
    saveToPath(content, packageName, subPath, genIndex);
}