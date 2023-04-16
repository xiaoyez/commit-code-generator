import {DataEnumOption} from "../definition/DataEnumOption";
import {DataEnum} from "../definition/DataEnum";
import {convertPackageToPath, convertPackageToSavePath, TSImportInfo} from "../../utils/TSImportInfo";
import {exist, mkdirs, writeStringToFile} from "../../utils/FileUtils";

export function generateEnumOption(def: DataEnumOption) {
    let line = `    ${def.sign} = ${def.value},`;
    if (def.description) {
        line = `    /** ${def.description} */\n` + line;
    }
    return line;
}

export function generateEnumDefine(def: DataEnum) {
    let fieldLines = def.options.map(prop => generateEnumOption(prop));
    return `export enum ${def.name} {\n${fieldLines.join('\n')}\n}`;
}

export function generateEnumDescConst(def: DataEnum) {
    let fieldLines = def.options.map(prop =>
        `    [${def.name}.${prop.sign}]: '${prop.description}',`);
    return `export const ${def.name}Desc = {\n${
        fieldLines.join('\n')
    }\n} as Record<${def.name}, string>`;
}

export function getEnumImportInfo(def: DataEnum): TSImportInfo {
    return {
        importPath: convertPackageToPath(def.package),
        importName: def.name,
    };
}

export function getEnumDescImportInfo(def: DataEnum): TSImportInfo {
    return {
        importPath: convertPackageToPath(def.package),
        importName: def.name + "Desc",
    };
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
    let enums = defs.map(def => {
        let enumStr = generateEnumDefine(def)
        if (!def.ruoyiDict) {
            let descStr = generateEnumDescConst(def);
            enumStr += '\n\n' + descStr;
        }
        return enumStr;
    });
    let content = enums.join('\n\n');
    let packageName = defs[0].package;

    let {dirPath, fileName} = convertPackageToSavePath(packageName, subPath, genIndex);
    let filePath = `${dirPath}/${fileName}`;

    if (!exist(dirPath))
        mkdirs(dirPath);

    writeStringToFile(filePath, content);
}