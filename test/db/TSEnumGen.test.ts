import {generateEnumDefsToFile} from "../../src/db/generator/TSEnumGenerator";
import {MemberStatusEnumDef} from "../data/enums";


describe('TSEnumGenerator', () => {

    it('generate to file', () => {
        generateEnumDefsToFile([MemberStatusEnumDef]);
        // TODO: 接口上缺注释
    })
});