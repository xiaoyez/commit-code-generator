import {DataEnumOption, IDataEnumOption} from "./DataEnumOption";
import {config} from "../../config/Config";

interface IDataEnum {
    name: string;
    options: IDataEnumOption[];
    package: string;
    ruoyiDict?: string;
    comment: string;
}

export class DataEnum {
    name!: string;
    options!: DataEnumOption[];
    package!: string;
    ruoyiDict?: string;
    comment!: string;

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

    static createCommon(name: string, options: IDataEnumOption[], comment: string, ruoyiDict?: string) {
        return new DataEnum({
            name,
            options,
            package: `${config.basePackage}.${config.constantPackage}.${config.projectName}`,
            comment,
            ruoyiDict,
        });
    }
}
