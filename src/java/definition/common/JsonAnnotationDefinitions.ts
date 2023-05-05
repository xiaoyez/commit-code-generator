import {AnnotationDefinition} from "../AnnotationDefinition";

export const JsonAnnotationDefinitions = {
    jsonFormat(timePattern: string): AnnotationDefinition {
        return new AnnotationDefinition('com.fasterxml.jackson.annotation','JsonFormat', [{name: 'pattern', value: timePattern},{name: 'timezone', value: 'GMT+8'}]);
    },

    jsonField(timePattern: string): AnnotationDefinition {
        return new AnnotationDefinition('com.alibaba.fastjson.annotation','JSONField', [{name: 'format', value: timePattern}]);
    }
}