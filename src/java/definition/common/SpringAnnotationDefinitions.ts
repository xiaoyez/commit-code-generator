import {AnnotationDefinition} from "../AnnotationDefinition";

export const SpringAnnotationDefinitions = {
    Service: new AnnotationDefinition('org.springframework.stereotype','Service'),
    RestController: new AnnotationDefinition('org.springframework.web.bind.annotation','RestController'),
    RequestMapping(path: string): AnnotationDefinition {
        return new AnnotationDefinition('org.springframework.web.bind.annotation','RequestMapping', [{name: 'value', value: path}]);
    },
    GetMapping(path: string): AnnotationDefinition {
        return new AnnotationDefinition('org.springframework.web.bind.annotation','GetMapping', path?[{name: 'value', value: path}]: []);
    },
    PostMapping(path: string): AnnotationDefinition {
        return new AnnotationDefinition('org.springframework.web.bind.annotation','PostMapping', path?[{name: 'value', value: path}]: []);
    },
    PutMapping(path: string): AnnotationDefinition {
        return new AnnotationDefinition('org.springframework.web.bind.annotation','PutMapping', path?[{name: 'value', value: path}]: []);
    },
    DeleteMapping(path: string): AnnotationDefinition {
        return new AnnotationDefinition('org.springframework.web.bind.annotation','DeleteMapping', path?[{name: 'value', value: path}]: []);
    },
    RequestBody: new AnnotationDefinition('org.springframework.web.bind.annotation','RequestBody'),
    Autowired: new AnnotationDefinition('org.springframework.beans.factory.annotation','Autowired'),
}