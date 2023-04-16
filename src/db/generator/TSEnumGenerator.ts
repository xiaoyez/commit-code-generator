import {DataEnumOption} from "../definition/DataEnumOption";
import {DataEnum} from "../definition/DataEnum";
import {convertPackageToPath, TSImportInfo} from "../../utils/TSImportInfo";

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
    }\n}`;
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
