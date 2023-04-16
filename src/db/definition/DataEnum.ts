import {DataEnumOption} from "./DataEnumOption";

interface IDataEnum {
    name: string;
    options: DataEnumOption[];
    package: string;
}

export class DataEnum {
    name!: string;
    options!: DataEnumOption[];
    package!: string;

    constructor(dataEnum: IDataEnum) {
        Object.assign(this,dataEnum)
    }
}