import {TopSearchItemDefinition} from "./TopSearchItemDefinition";

interface ITopSearchDefinition {
    model: string,
    items: TopSearchItemDefinition[]
}

export class TopSearchDefinition implements ITopSearchDefinition {
    model!: string;
    items!: TopSearchItemDefinition[];

    constructor(prop: ITopSearchDefinition) {
        Object.assign(this, prop);
    }

    static create( items: TopSearchItemDefinition[], model: string = 'queryParams') {
        return new TopSearchDefinition({model, items});
    }
}