import {ObjectTypeDefinitionUtils} from "../src/dto/definition/ObjectTypeDefinitionUtils";
import {tableUserDefinition} from "./DDLSqlGenerator.test";
import {MapperGenerator} from "../src/dto/generator/MapperGenerator";

const domainTypeDefinition = ObjectTypeDefinitionUtils.castTableCreateDefinitionToDomainTypeDefinition(tableUserDefinition);

test('generate mapper', () => {
    MapperGenerator.generate(domainTypeDefinition);
} )