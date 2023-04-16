import {IPropertyDefinition, ObjectTypeDefinition, TypeDefinition} from "../definition/TypeDefinition";
import {JavaType} from "../definition/JavaType";
import {convertPackageToPath, TSImportInfo} from "../../utils/TSImportInfo";

let javaTypeInTS = {
    [JavaType.Boolean]: 'boolean',
    [JavaType.Byte]: 'number',
    [JavaType.Short]: 'number',
    [JavaType.Integer]: 'number',
    [JavaType.Long]: 'bigint',
    [JavaType.Float]: 'number',
    [JavaType.Double]: 'number',
    [JavaType.Character]: 'string',
    [JavaType.String]: 'string',
    [JavaType.Date]: 'Date',
    [JavaType.List]: 'Array',
} as Record<JavaType, string>;

export function generateTypeString(def: TypeDefinition) {
    let typeName: string;
    if (def.type instanceof ObjectTypeDefinition) {
        typeName = def.type.className;
    }
    else {
        typeName = javaTypeInTS[def.type];
    }

    if (def.genericTypes) {
        let genericList = def.genericTypes
            .map(def => generateTypeString(def));
        if (typeName === 'Array') {
            if (def.genericTypes.length === 1) {
                typeName = `${genericList[0]}[]`;
            }
            else {
                throw new Error('数组只能有一个泛型参数');
            }
        }
        else {
            typeName += `<${genericList.join(', ')}>`;
        }

    }
    else if (typeName === 'Array') {
        throw new Error('数组不能没有泛型参数');
    }
    return typeName;
}

export function generateObjectField(def: IPropertyDefinition) {
    let typeString;
    if (def.enumType) {
        typeString = def.enumType.name;
    }
    else {
        typeString = generateTypeString(def.paramType);
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
    return {
        importPath: convertPackageToPath(def.packageName),
        importName: def.className,
    }
}