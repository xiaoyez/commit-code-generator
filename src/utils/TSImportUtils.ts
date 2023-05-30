import {config} from "../config/Config";
import {ObjectTypeDefinition, TypeDefinition} from "../dto/definition/TypeDefinition";
import {convertPackageToPath} from "./TSPathUtils";
import {DataEnum} from "../db/definition/DataEnum";
import {compileEjsTmp} from "../ejsTmp/EjsUtils";
import {tsObjDefTypeName} from "./TypeUtils";
import {ModuleDefinition} from "../api/definition/ModuleDefinition";

// 基包
const BasePackage = `${config.projectPackage}.${config.dtoPackage}`;
// 公共模块
const CommonModule = `${BasePackage}.common`;

// 核心类型
const CoreTypes = new Set([
    'IRespData',
    'IRespPaging',
])

// 导入类型
enum ImportType {
    Object = 0,
    Type = 1,
}

// Ts导入信息
interface TSImportInfo {
    importPath: string;
    importName: string;
    importType?: ImportType; // default: Object
}

// 导入行数组信息
type ImportLinesInfo = Map<string, Map<string, ImportType>>;

// 导入行记录
type ImportLinesRecord = Record<string, { type?: string[], objs?: string[] }>;

/**
 * 创建空的导入行信息
 */
export function emptyImportLines(): ImportLinesInfo {
    return new Map();
}

/**
 * 添加导入信息
 * @param info
 * @param cur
 * @param isType
 */
export function addNewImport(info: TSImportInfo, cur: ImportLinesInfo, isType?: boolean) {
    let imported = cur.get(info.importPath);
    if (!imported) {
        imported = new Map();
        cur.set(info.importPath, imported);
    }
    if (isType === undefined) {
        isType = info.importType === ImportType.Type;
    }
    // 防止实现导入被修改为类型导入
    if (isType && imported.has(info.importName)) {
        return;
    }
    imported.set(info.importName, isType ? ImportType.Type : ImportType.Object);
}

/**
 * 获取类型导入信息
 * @param def
 */
function getTypeImportInfo(def: ObjectTypeDefinition): TSImportInfo {
    let importName = tsObjDefTypeName(def);
    let packageName = CoreTypes.has(importName) ? CommonModule : def.packageName;
    let importPath = convertPackageToPath(packageName);
    return {importPath, importName, importType: ImportType.Type}
}

/**
 * 获取枚举导入信息
 * @param def
 */
export function getEnumImportInfo(def: DataEnum): TSImportInfo {
    return {
        importPath: convertPackageToPath(def.package),
        importName: def.name,
        importType: ImportType.Object,
    };
}

/**
 * 获取枚举描述导入信息
 * @param def
 */
export function getEnumDescImportInfo(def: DataEnum): TSImportInfo {
    return {
        importPath: convertPackageToPath(def.package),
        importName: def.name + "Desc",
        importType: ImportType.Object,
    };
}


export function getTypeImportsFrom(def: TypeDefinition, cur?: ImportLinesInfo) {
    if (!cur) {
        cur = new Map();
    }

    if (def.type instanceof ObjectTypeDefinition) {
        addNewImport(getTypeImportInfo(def.type), cur);
    } else {
        // some local defined types
    }
    if (def.genericTypes) {
        for (let generic of def.genericTypes) {
            getTypeImportsFrom(generic, cur);
        }
    }
    return cur;
}

export function getTypeUsingImports(def: ObjectTypeDefinition, cur?: ImportLinesInfo) {
    if (!cur) {
        cur = new Map();
    }

    for (let prop of def.properties) {
        if (prop.enumType) {
            addNewImport(getEnumImportInfo(prop.enumType), cur);
        } else {
            getTypeImportsFrom(prop.paramType, cur);
        }
    }

    return cur;
}

export function getImportLinesRecord(imports: ImportLinesInfo) {
    let res = {} as ImportLinesRecord;
    for (let [module, imported] of imports) {
        if (imported.size === 0) continue;
        let types = [], objs = [];
        for (let [name, type] of imported) {
            if (type === ImportType.Type) {
                types.push(name);
            } else {
                objs.push(name);
            }
        }
        res[module] = {};
        if (objs.length > 0) {
            res[module].objs = objs;
        }
        if (types.length > 0) {
            res[module].type = types;
        }
    }
    return res;
}

let ejsTmp: typeof import('../ejsTmp/EjsTmp').ejsTmp;
(function () {
    import('../ejsTmp/EjsTmp').then(m => ejsTmp = m.ejsTmp);
})();

export function generateImportLines(imports: ImportLinesInfo|ImportLinesRecord) {
    if (imports instanceof Map) {
        imports = getImportLinesRecord(imports);
    }
    return compileEjsTmp(ejsTmp.tsImportLinesTmp, imports);
}

export function getInterfaceModuleImportLines(defs: ObjectTypeDefinition[]) {
    let imports = emptyImportLines();
    for (let def of defs) {
        getTypeUsingImports(def, imports);
    }
    return imports.size ? getImportLinesRecord(imports) : void 0;
}

export function getApiCallModuleImportLines({apis}: ModuleDefinition) {
    let imports = apis.reduce((importMap, apiDef) => {
        if (apiDef.params) {
            importMap = getTypeImportsFrom(apiDef.params, importMap);
        }

        if (apiDef.result) {
            importMap = getTypeImportsFrom(apiDef.result, importMap);
        }
        return importMap;
    }, emptyImportLines());
    return imports.size ? getImportLinesRecord(imports) : void 0;
}