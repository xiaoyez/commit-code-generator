import {
    generateInterfaceDefine,
    generateObjectField,
    generateTypeString
} from "../src/api/generator/TSInterfaceGenerator";
import {JavaType} from "../src/api/definition/JavaType";
import {ObjectTypeDefinition, TypeDefinition} from "../src/api/definition/TypeDefinition";

describe('TSInterfaceGenerator', () => {
    let interfaceDef = new ObjectTypeDefinition({
        className: 'TestResp',
        packageName: 'testPack.testDef',
        properties: [
            {
                paramName: "fieldA",
                paramType: new TypeDefinition({
                    type: JavaType.Long,
                }),
                paramDesc: "bigInt field",
            },
            {
                paramName: "fieldB",
                paramType: new TypeDefinition({
                    type: JavaType.Float,
                }),
            }
        ]
    });

    it('generate an single type string', () => {
        expect(generateTypeString(new TypeDefinition({
            type: JavaType.Date,
        }))).toBe('Date');
    });

    it('generate an array type string', () => {
        expect(generateTypeString(new TypeDefinition({
            type: JavaType.List,
            genericTypes: [
                {type: interfaceDef}
            ],
        }))).toBe('TestResp[]');
    });

    it('generate field define line', () => {
        expect(generateObjectField(interfaceDef.properties[1])).toBe('    fieldB: number;')
    });

    it('generate field with desc', () => {
        expect(generateObjectField(interfaceDef.properties[0])).toBe(`    /** bigInt field */
    fieldA: bigint;`)
    });

    it('generate interface define', () => {
        expect(generateInterfaceDefine(interfaceDef)).toBe(`export interface TestResp {
    /** bigInt field */
    fieldA: bigint;
    fieldB: number;
}`);
    });
});