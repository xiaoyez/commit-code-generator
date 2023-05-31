import {generateInterfaceDefsToFile} from "../../src/dto/generator/TSInterfaceGenerator";
import {tbMemberDomainTypeDef, TbMemberSearchDTODef} from "../data/DTO";
import {ObjectTypeDefinition} from "../../src/dto/definition/TypeDefinition";

describe('TSInterfaceGenerator', () => {

    it('generate to file', () => {
        generateInterfaceDefsToFile([tbMemberDomainTypeDef, (TbMemberSearchDTODef.type as ObjectTypeDefinition)]);
        // TODO: 生成文件的时候套了两层dto
    });
});