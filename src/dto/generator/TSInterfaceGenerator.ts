import {IPropertyDefinition, ObjectTypeDefinition, TypeDefinition} from "../definition/TypeDefinition";
import {convertPackageToPath, saveToPath, TSImportInfo} from "../../utils/TSPathUtils";
import {getEnumImportInfo} from "../../db/generator/TSEnumGenerator";
import {config} from "../../config/Config";
import {tsTypeString} from "../../utils/TypeUtils";

const BasePackage = `${config.basePackage}.${config.dtoPackage}`;
const CoreModule = `${BasePackage}.core`;

let preDefinedTypes = new Map([
    ['AjaxResult', CoreModule],
    ['TableDataInfo', CoreModule],
]);

export function generateObjectField(def: IPropertyDefinition) {
    let typeString;
    if (def.enumType) {
        typeString = def.enumType.name;
    }
    else {
        typeString = tsTypeString(def.paramType);
    }
    let propLine = `    ${def.paramName}: ${typeString};`;
    if (def.paramDesc) {
        propLine = `    /** ${def.paramDesc} */\n` + propLine;
    }
    return propLine;
}

export function generateInterfaceDefine(def: ObjectTypeDefinition) {
    let fieldLines = def.properties.map(prop => generateObjectField(prop));
    return `export interface ${def.className} {\n${fieldLines.join('\n')}\n}`;
}

export function getImportInfo(def: ObjectTypeDefinition): TSImportInfo {
    if (preDefinedTypes.has(def.className)) {
        return {
            importPath: convertPackageToPath(preDefinedTypes.get(def.className)!),
            importName: def.className,
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
        let info = getImportInfo(def.type);
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

export function getImportsFrom(def: ObjectTypeDefinition, cur?: Map<string, Set<string>>) {
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

export function generateInterfaceDefsToFile(defs: ObjectTypeDefinition[], subPath = "", genIndex = false) {
    if (!defs || defs.length === 0) {
        return;
    }

    let imports = new Map<string, Set<string>>();
    let interfaces = defs.map(def => {
        getImportsFrom(def, imports);
        return generateInterfaceDefine(def);
    });
    let importLines = [...imports.entries()].map(([path, names]) => {
        return `import {${[...names].join(', ')}} from "${path}";`;
    });
    let content = importLines.join('\n') + '\n\n' + interfaces.join('\n\n') + '\n';

    saveToPath(content, defs[0].packageName, subPath, genIndex);
}