import {DataEnum} from "../src/db/definition/DataEnum";
import {DataEnumOption} from "../src/db/definition/DataEnumOption";
import {
    generateEnumDefsToFile, generateSingleEnumDefine
} from "../src/db/generator/TSEnumGenerator";
import {auditStatusEnumDef} from "./common";
import {cloneDeep} from "lodash";

describe('TSEnumGenerator', () => {
    const dataEnum = auditStatusEnumDef;

    const notRuoyiEnum = cloneDeep(dataEnum);
    notRuoyiEnum.ruoyiDict = undefined;

    it('generate an enum define', () => {
        expect(generateSingleEnumDefine(dataEnum)).toBe(`export enum AuditStatusConstant {
    /** 审核中 */
    AUDITING = 1,
    /** 通过 */
    PASS = 2,
    /** 拒绝 */
    REJECT = 3,
}
`);
    });

    it('generate an enum with desc const', () => {
        expect(generateSingleEnumDefine(notRuoyiEnum)).toBe(`export enum AuditStatusConstant {
    /** 审核中 */
    AUDITING = 1,
    /** 通过 */
    PASS = 2,
    /** 拒绝 */
    REJECT = 3,
}

export const AuditStatusConstantDesc = {
    [AuditStatusConstant.AUDITING]: '审核中',
    [AuditStatusConstant.PASS]: '通过',
    [AuditStatusConstant.REJECT]: '拒绝',
} as Record<AuditStatusConstant, string>;
`);
    });

    const enum2 = new DataEnum({
        name: "TestEnum2",
        comment: "",
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