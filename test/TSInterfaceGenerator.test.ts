import {
    generateInterfaceDefine,
    generateInterfaceDefsToFile,
} from "../src/dto/generator/TSInterfaceGenerator";
import {JavaType} from "../src/dto/definition/JavaType";
import {ObjectTypeDefinition, TypeDefinition} from "../src/dto/definition/TypeDefinition";
import {config} from "../src/config/Config";
import {auditStatusEnumDef} from "./common";

describe('TSInterfaceGenerator', () => {

    let interfaceDef = new ObjectTypeDefinition({
        className: 'TestResp',
        packageName: `${config.projectPackage}.${config.dtoPackage}.testOther`,
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
                enumType: auditStatusEnumDef,
            }
        ]
    });

    it('generate interface define', () => {
        expect(generateInterfaceDefine(interfaceDef)).toBe(`export interface TestResp {
    /** bigInt field */
    fieldA: bigint;
    fieldB: number;
    fieldC: AuditStatusConstant;
}`);
    });

    let testPackage = `${config.projectPackage}.${config.dtoPackage}.test`;
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
                    enumType: auditStatusEnumDef,
                },
            ]
        }),
    ]

    it('generate to file', () => {
        generateInterfaceDefsToFile([interfaceDef]);
        generateInterfaceDefsToFile(moduleDefs);
    });
});