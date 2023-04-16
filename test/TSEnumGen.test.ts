import {DataEnum} from "../src/db/definition/DataEnum";
import {DataEnumOption} from "../src/db/definition/DataEnumOption";
import {
    generateEnumDefine,
    generateEnumDefsToFile,
    generateEnumDescConst,
    getEnumDescImportInfo,
    getEnumImportInfo
} from "../src/db/generator/TSEnumGenerator";

describe('TSEnumGenerator', () => {
    const dataEnum = new DataEnum({
        name: "AuditStatusConstant",
        package: "com.example.demo.constants",
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
            }),
            new DataEnumOption({
                description: "拒绝",
                sign: "REJECT",
                value: 3
            }),
        ],
        ruoyiDict: "test_audit_status",
    })

    it('generate an enum define', () => {
        expect(generateEnumDefine(dataEnum)).toBe(`export enum AuditStatusConstant {
    /** 审核中 */
    AUDITING = 1,
    /** 通过 */
    PASS = 2,
    /** 拒绝 */
    REJECT = 3,
}`);
    });

    it('generate an enum desc const', () => {
        expect(generateEnumDescConst(dataEnum)).toBe(`export const AuditStatusConstantDesc = {
    [AuditStatusConstant.AUDITING]: '审核中',
    [AuditStatusConstant.PASS]: '通过',
    [AuditStatusConstant.REJECT]: '拒绝',
} as Record<AuditStatusConstant, string>`);
    });

    it('get import info of an define', () => {
        expect(getEnumImportInfo(dataEnum)).toEqual({
            importPath: "@/constants",
            importName: "AuditStatusConstant",
        })
    })

    it('get desc import info of an define', () => {
        expect(getEnumDescImportInfo(dataEnum)).toEqual({
            importPath: "@/constants",
            importName: "AuditStatusConstantDesc",
        })
    })
    const enum2 = new DataEnum({
        name: "TestEnum2",
        package: "com.example.demo.constants",
        options: [
            new DataEnumOption({
                description: "选1",
                sign: "Test1",
                value: 1
            }),
            new DataEnumOption({
                description: "选2",
                sign: "Test2",
                value: 2
            }),
        ],
    })

    it('generate to file', () => {
        generateEnumDefsToFile([dataEnum, enum2], 'front-end', true);
    })
});