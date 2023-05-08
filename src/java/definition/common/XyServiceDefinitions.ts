import {JavaTypeDefinition} from "../JavaTypeDefinition";
import {InterfaceDefinition} from "../InterfaceDefinition";

export const XyServiceDefinitions = {
    IBaseService(domainType: JavaTypeDefinition, mapperType: JavaTypeDefinition) {
        const definition = new InterfaceDefinition('com.xy.common.service', 'IBaseService');
        definition.addGenericType(domainType);
        definition.addGenericType(mapperType);
        return definition;
    },

    IBatchService(domainType: JavaTypeDefinition, mapperType: JavaTypeDefinition) {
        const definition = new InterfaceDefinition('com.xy.common.service', 'IBatchService');
        definition.addGenericType(domainType);
        definition.addGenericType(mapperType);
        return definition;
    },

    ISearchService(domainType: JavaTypeDefinition, mapperType: JavaTypeDefinition) {
        const definition = new InterfaceDefinition('com.xy.common.service', 'ISearchService');
        definition.addGenericType(domainType);
        definition.addGenericType(mapperType);
        return definition;
    }
}