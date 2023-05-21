import {config} from "../config/Config";
import {ObjectTypeDefinition, TypeDefinition} from "../dto/definition/TypeDefinition";
import {convertPackageToPath, TSImportInfo} from "./TSPathUtils";
import {getEnumImportInfo} from "../db/generator/TSEnumGenerator";

const BasePackage = `${config.basePackage}.${config.dtoPackage}`;
const CoreModule = `${BasePackage}.common`;

const FrontType: Record<string, string> = {
    ['AjaxResult']: 'IRespData',
    ['TableDataInfo']: 'IRespPaging',
}

function getTypeImportInfo(def: ObjectTypeDefinition): TSImportInfo {
    if (FrontType[def.className]) {
        return {
            importPath: convertPackageToPath(CoreModule),
            importName: FrontType[def.className],
        }
    }

    return {
        importPath: convertPackageToPath(def.packageName),
        importName: def.className,
    }
}

export function getTypeImportsFrom(def: TypeDefinition, cur?: Map<string, Set<string>>) {
    if (!cur) {
        cur = new Map();
    }

    if (def.type instanceof ObjectTypeDefinition) {
        let info = getTypeImportInfo(def.type);
        let set = cur.get(info.importPath) || new Set();
        set.add(info.importName);
        cur.set(info.importPath, set);
    }
    else {
        // some local defined types
    }
    if (def.genericTypes) {
        for (let generic of def.genericTypes) {
            getTypeImportsFrom(generic, cur);
        }
    }
    return cur;
}

export function getTypeUsingImports(def: ObjectTypeDefinition, cur?: Map<string, Set<string>>) {
    if (!cur) {
        cur = new Map();
    }

    for (let prop of def.properties) {
        if (prop.enumType) {
            let info = getEnumImportInfo(prop.enumType);
            let set = cur.get(info.importPath) || new Set();
            set.add(info.importName);
            cur.set(info.importPath, set);
        }
        else {
            getTypeImportsFrom(prop.paramType, cur);
        }
    }

    return cur;
}