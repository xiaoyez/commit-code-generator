import {ObjectTypeDefinitionUtils} from "../../src/dto/definition/ObjectTypeDefinitionUtils";
import {tbMemberTableDef} from "./DbData";

/**
 * 会员表对应的实体类的定义
 */
export const tbMemberDomainTypeDef = ObjectTypeDefinitionUtils.castTableCreateDefinitionToDomainTypeDefinition(tbMemberTableDef);