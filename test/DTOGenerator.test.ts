
import {DTOGenerator} from "../src/dto/generator/DTOGenerator";
import {tbMemberDomainTypeDef} from "./data/DTO";
import {JavaGeneratorUtils} from "../src/java/generator/utils/JavaGeneratorUtils";


test('test generate',()=>{
    DTOGenerator.generate(tbMemberDomainTypeDef);
})

