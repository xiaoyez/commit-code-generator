import {MapperGenerator} from "../src/dto/generator/MapperGenerator";
import {tbMemberDomainTypeDef} from "./data/DTO";

test('generate mapper', () => {
    MapperGenerator.generate(tbMemberDomainTypeDef);
} )