import {DataEnumOption, IDataEnumOption} from "./DataEnumOption";

interface IDataEnum {
    name: string;
    options: IDataEnumOption[];
    package: string;
    ruoyiDict?: string;
}

export class DataEnum {
    name!: string;
    options!: DataEnumOption[];
    package!: string;
    ruoyiDict?: string;

    constructor(dataEnum: IDataEnum) {
        Object.assign(this,dataEnum);
        this.options = dataEnum.options.map(option => {
            if (option instanceof DataEnumOption) {
                return option;
            }
            else {
                return new DataEnumOption(option);
            }
        });
    }
}