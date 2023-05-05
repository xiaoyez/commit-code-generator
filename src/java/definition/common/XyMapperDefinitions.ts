import {InterfaceDefinition} from "../InterfaceDefinition";
import {JavaTypeDefinition} from "../JavaTypeDefinition";

export const XyMapperDefinitions = {
    mapper(domainType: JavaTypeDefinition) {
        const definition = new InterfaceDefinition('com.xy.common.mapper', 'Mapper');
        definition.addGenericType(domainType);
        return definition;
    },

    batchMapper(domainType: JavaTypeDefinition) {
        const definition = new InterfaceDefinition('com.xy.common.mapper', 'BatchMapper');
        definition.addGenericType(domainType);
        return definition;
    },

    searchMapper(domainType: JavaTypeDefinition) {
        const definition = new InterfaceDefinition('com.xy.common.mapper', 'SearchMapper');
        definition.addGenericType(domainType);
        return definition;
    }
}