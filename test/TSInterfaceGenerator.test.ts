import {
    generateInterfaceDefine,
    generateInterfaceDefsToFile,
    generateObjectField,
} from "../src/dto/generator/TSInterfaceGenerator";
import {JavaType} from "../src/dto/definition/JavaType";
import {ObjectTypeDefinition, TypeDefinition} from "../src/dto/definition/TypeDefinition";
import {DataEnum} from "../src/db/definition/DataEnum";
import {DataEnumOption} from "../src/db/definition/DataEnumOption";
import {config} from "../src/config/Config";
import {tsTypeString} from "../src/utils/TypeUtils";

describe('TSInterfaceGenerator', () => {
    const dataEnum = new DataEnum({
        name: "AuditStatusConstant",
        package: `${config.basePackage}.${config.constantPackage}.common`,
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
            }), new DataEnumOption({
                description: "拒绝",
                sign: "REJECT",
                value: 3
            }),
        ],
        ruoyiDict: "test_audit_status",
    })

    let interfaceDef = new ObjectTypeDefinition({
        className: 'TestResp',
        packageName: `${config.basePackage}.${config.dtoPackage}.testOther`,
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
        expect(tsTypeString(new TypeDefinition({
            type: JavaType.Date,
        }))).toBe('Date');
    });

    it('generate an array type string', () => {
        expect(tsTypeString(new TypeDefinition({
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

    let testPackage = `${config.basePackage}.${config.dtoPackage}.test`;
    let moduleDefs = [
        new ObjectTypeDefinition({
            className: "TypeA",
            packageName: testPackage,
            properties: [
                {
                    paramName: "fieldA", paramType: new TypeDefinition({
                        type: JavaType.List, genericTypes: [{type: JavaType.Date}]
                    })
                },
                {paramName: "fieldB", paramType: new TypeDefinition({type: JavaType.Integer})},
            ]
        }),
        new ObjectTypeDefinition({
            className: "TypeB",
            packageName: testPackage,
            properties: [
                {paramName: "fieldC", paramType: new TypeDefinition({type: interfaceDef})},
            ]
        }),
        new ObjectTypeDefinition({
            className: "TypeC",
            packageName: testPackage,
            properties: [
                {
                    paramName: "fieldD",
                    paramType: new TypeDefinition({type: JavaType.Integer}),
                    enumType: dataEnum,
                },
            ]
        }),
    ]

    it('generate to file', () => {
        generateInterfaceDefsToFile([interfaceDef], 'front-end');
        generateInterfaceDefsToFile(moduleDefs, 'front-end');
    });
});