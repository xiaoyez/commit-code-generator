import {config} from "../config/Config";
import {ObjectTypeDefinition, TypeDefinition} from "../dto/definition/TypeDefinition";
import {convertPackageToPath} from "./TSPathUtils";
import {DataEnum} from "../db/definition/DataEnum";

const BasePackage = `${config.basePackage}.${config.dtoPackage}`;
const CoreModule = `${BasePackage}.common`;

const FrontType: Record<string, string> = {
    ['AjaxResult']: 'IRespData',
    ['TableDataInfo']: 'IRespPaging',
}

enum ImportType {
    Object = 0,
    Type = 1,
}

interface TSImportInfo {
    importPath: string;
    importName: string;
    importType?: ImportType; // default: Object
}

export type ImportLinesInfo = Map<string, Map<string, ImportType>>;

export function emptyImportLines(): ImportLinesInfo {
    return new Map();
}

export function addNewImport(info: TSImportInfo, cur: ImportLinesInfo) {
    let imported = cur.get(info.importPath);
    if (!imported) {
        imported = new Map();
        cur.set(info.importPath, imported);
    }
    let isType = info.importType === ImportType.Type;
    // 防止实现导入被修改为类型导入
    if (isType && imported.has(info.importName)) {
        return;
    }
    imported.set(info.importName, isType ? ImportType.Type : ImportType.Object);
}

function getTypeImportInfo(def: ObjectTypeDefinition): TSImportInfo {
    if (FrontType[def.className]) {
        return {
            importPath: convertPackageToPath(CoreModule),
            importName: FrontType[def.className],
            importType: ImportType.Type,
        }
    }

    return {
        importPath: convertPackageToPath(def.packageName),
        importName: def.className,
        importType: ImportType.Type,
    }
}

export function getEnumImportInfo(def: DataEnum): TSImportInfo {
    return {
        importPath: convertPackageToPath(def.package),
        importName: def.name,
        importType: ImportType.Object,
    };
}

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

export function generateImportLines(imports: ImportLinesInfo) {
    let text = "";
    for (let [module, imported] of imports) {
        let types = [], objs = [];
        for (let [name, type] of imported) {
            if (type === ImportType.Type) {
                types.push(name);
            } else {
                objs.push(name);
            }
        }
        if (objs.length > 0) {
            text += `import {${[...objs].join(', ')}} from "${module}";\n`;
        }
        if (types.length > 0) {
            text += `import type {${[...types].join(', ')}} from "${module}";\n`;
        }
    }
    return text;
}
