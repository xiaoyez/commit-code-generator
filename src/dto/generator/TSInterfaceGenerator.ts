import {IPropertyDefinition, ObjectTypeDefinition} from "../definition/TypeDefinition";
import {saveToPath} from "../../utils/TSPathUtils";
import {tsTypeString} from "../../utils/TypeUtils";
import {getTypeUsingImports} from "../../utils/TSImportUtils";

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

export function generateInterfaceDefsToFile(defs: ObjectTypeDefinition[], subPath = "/src", genIndex = false) {
    if (!defs || defs.length === 0) {
        return;
    }

    let imports = new Map<string, Set<string>>();
    let interfaces = defs.map(def => {
        getTypeUsingImports(def, imports);
        return generateInterfaceDefine(def);
    });
    let importLines = [...imports.entries()].map(([path, names]) => {
        return `import {${[...names].join(', ')}} from "${path}";`;
    });
    let content = importLines.join('\n') + '\n\n' + interfaces.join('\n\n') + '\n';

    saveToPath(content, defs[0].packageName, subPath, genIndex);
}