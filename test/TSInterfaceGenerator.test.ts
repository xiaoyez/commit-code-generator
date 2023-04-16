import {
    generateInterfaceDefine,
    generateObjectField,
    generateTypeString
} from "../src/dto/generator/TSInterfaceGenerator";
import {JavaType} from "../src/dto/definition/JavaType";
import {ObjectTypeDefinition, TypeDefinition} from "../src/dto/definition/TypeDefinition";
import {DataEnum} from "../src/db/definition/DataEnum";
import {DataEnumOption} from "../src/db/definition/DataEnumOption";

describe('TSInterfaceGenerator', () => {
    const dataEnum = new DataEnum({
        name: "AuditStatusConstant",
        package: "com.example.demo.ypx.constants",
        options: [
            new DataEnumOption({
                description: "审核中",
                sign: "AUDITING",
                value: 1
            }),
            new DataEnumOption({
                description: "通过",
                sign: "PASS",
                value: 2
            }),new DataEnumOption({
                description: "拒绝",
                sign: "REJECT",
                value: 3
            }),
        ],
        ruoyiDict: "test_audit_status",
    })

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
            },
            {
                paramName: "fieldC",
                paramType: new TypeDefinition({
                    type: JavaType.Integer,
                }),
                enumType: dataEnum,
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
    fieldC: AuditStatusConstant;
}`);
    });
});