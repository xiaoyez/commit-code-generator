
import {DTOGenerator} from "../../src/dto/generator/DTOGenerator";
import {tbMemberDomainTypeDef} from "../data/DTO";


test('test generate',()=>{
    DTOGenerator.generate(tbMemberDomainTypeDef);
})

