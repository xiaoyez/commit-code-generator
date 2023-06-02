import {ApiDefinition} from "../../../../api/definition/ApiDefinition";
import {FormDefinition, InputControl} from "./FormDefinition";

export interface FilterDefinition {
    fileName: string;

    filterFormDefinition: FilterFormDefinition;

    api: ApiDefinition;

    packageName?: string;
}

export interface FilterFormDefinition extends FormDefinition {
    refName?: string;
    vShowName?: string;
}

export interface FilterFormItemDefinition {
    label: string;
    prop: string;
    inputControl: InputControl;
}

