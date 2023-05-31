import {ObjectTypeDefinition, TypeDefinition} from "../dto/definition/TypeDefinition";
import {convertPackageToPath} from "./TSPathUtils";
import {DataEnum} from "../db/definition/DataEnum";
import {compileEjsTmp} from "../ejsTmp/EjsUtils";
import {tsObjDefTypeName} from "./TypeUtils";
import {ModuleDefinition} from "../api/definition/ModuleDefinition";
import {getFullPackageName, PackageType} from "./PackageUtils";

// 公共模块
const CommonModule = 'common';

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

// 核心类型导入信息
const CoreTypesImportInfo: Record<string, TSImportInfo> = {
    IRespData: {
        importPath: '@/dataType/common',
        importName: 'IRespData',
        importType: ImportType.Type,
    },

    IRespPaging: {
        importPath: '@/dataType/common',
        importName: 'IRespPaging',
        importType: ImportType.Type,
    },
};

// 导入信息表
type ImportLinesInfo = Map<string, Map<string, ImportType>>;

// 导入行数组记录
type ImportLinesRecord = Record<string, { type?: string[], objs?: string[] }>;

/**
 * 创建空的导入信息表
 */
export function emptyImportLines(): ImportLinesInfo {
    return new Map();
}

/**
 * 添加单个导入信息
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
 * 获取单个类型定义的导入信息
 * @param def
 */
function getTypeImportInfo(def: ObjectTypeDefinition): TSImportInfo {
    let importName = tsObjDefTypeName(def);
    if (CoreTypesImportInfo[importName]) {
        return CoreTypesImportInfo[importName];
    }
    let packageName = getFullPackageName(PackageType.DTO, def.packageName);
    let importPath = convertPackageToPath(packageName);
    return {importPath, importName, importType: ImportType.Type}
}

/**
 * 获取单个枚举定义的导入信息
 * @param def
 */
export function getEnumImportInfo(def: DataEnum): TSImportInfo {
    return {
        importPath: convertPackageToPath(getFullPackageName(PackageType.CONSTANT, def.package)),
        importName: def.name,
        importType: ImportType.Object,
    };
}

/**
 * 获取单个枚举的描述对象的导入信息
 * @param def
 */
export function getEnumDescImportInfo(def: DataEnum): TSImportInfo {
    return {
        importPath: convertPackageToPath(getFullPackageName(PackageType.CONSTANT, def.package)),
        importName: def.name + "Desc",
        importType: ImportType.Object,
    };
}

/**
 * 获取当使用一个类型时，需要导入的类型定义信息
 * @param def 要使用的类型
 * @param cur 不创建新表，直接将导入信息添加到现有表中
 */
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

/**
 * 获取一个类型其定义时所要导入内容的信息
 * @param def 被定义的类型
 * @param cur 不创建新表，直接将导入信息添加到现有表中
 */
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

/**
 * 将导入信息表转换为易于ejs处理的导入行数组
 */
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

/**
 * 生成用于导入指定内容的代码片段
 * @param imports
 */
export function generateImportLines(imports: ImportLinesInfo | ImportLinesRecord) {
    if (imports instanceof Map) {
        imports = getImportLinesRecord(imports);
    }
    return compileEjsTmp(ejsTmp.tsImportLinesTmp, imports);
}

/**
 * 生成一个对象类型定义模块需要的全部导入内容
 * @param defs
 */
export function getInterfaceModuleImportLines(defs: ObjectTypeDefinition[]) {
    let imports = emptyImportLines();
    for (let def of defs) {
        getTypeUsingImports(def, imports);
    }
    return imports.size ? getImportLinesRecord(imports) : void 0;
}

/**
 * 生成一个Api请求方法模块需要的全部导入内容
 * @param apis
 */
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