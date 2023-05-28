import {IPropertyDefinition, ObjectTypeDefinition, TypeDefinition} from "../dto/definition/TypeDefinition";
import {tsTypeMapper} from "../dto/definition/TypeMapper";

const FrontTypeName: Record<string, string> = {
    ['AjaxResult']: 'IRespData',
    ['TableDataInfo']: 'IRespPaging',
}

export function tsObjDefTypeName(def: ObjectTypeDefinition) {
    return FrontTypeName[def.className] || def.className;
}

export function isOfType<T>(
    target: unknown,
    prop: keyof T
): target is T {
    return (target as T)[prop] !== undefined;
}

export function tsTypeString(def: TypeDefinition) {
    let typeName: string;
    if (def.type instanceof ObjectTypeDefinition) {
        typeName = tsObjDefTypeName(def.type);
    }
    else {
        typeName = tsTypeMapper[def.type];
    }

    if (def.genericTypes) {
        let genericList = def.genericTypes
            .map(def => tsTypeString(def));
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

export function fieldTypeString(def: IPropertyDefinition) {
    if (def.enumType) {
        return def.enumType.name;
    }
    else {
        return tsTypeString(def.paramType);
    }
}
