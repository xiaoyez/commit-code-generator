import {FilterDefinition, FilterFormDefinition} from "../../definition/index/FilterDefinition";

export class FilterGenerator {
    static generate(filterDefinition: FilterDefinition) {
        let text = '';
        text += FilterGenerator.generateTemplate(filterDefinition.filterFormDefinition);

    }

    private static generateTemplate(filterFormDefinition: FilterFormDefinition) {
        let text = '';
        text += '<template>';
        text += FilterGenerator.generateFilterForm(filterFormDefinition);
        text += '</template>';
        return text;
    }


    private static generateFilterForm(filterFormDefinition: FilterFormDefinition) {
        return "";
    }
}