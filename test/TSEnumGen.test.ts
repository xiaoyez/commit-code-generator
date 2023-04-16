import {DataEnum} from "../src/db/definition/DataEnum";
import {DataEnumOption} from "../src/db/definition/DataEnumOption";
import {
    generateEnumDefine,
    generateEnumDescConst,
    getEnumDescImportInfo,
    getEnumImportInfo
} from "../src/db/generator/TSEnumGenerator";

describe('TSEnumGenerator', () => {
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
}`)
    });

    it('get import info of an define', () => {
        expect(getEnumImportInfo(dataEnum)).toEqual({
            importPath: "@/ypx/constants",
            importName: "AuditStatusConstant",
        })
    })

    it('get desc import info of an define', () => {
        expect(getEnumDescImportInfo(dataEnum)).toEqual({
            importPath: "@/ypx/constants",
            importName: "AuditStatusConstantDesc",
        })
    })
});