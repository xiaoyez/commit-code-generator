import {FilterDefinition} from "../../definition/page/FilterDefinition";
import {compileEjsTmp} from "../../../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../../../ejsTmp/EjsTmp";
import {filterCompViewModel} from "../../../../utils/VueComponentUtils";

export class FilterGenerator {

    static generate(filterDefinition: FilterDefinition) {
        return compileEjsTmp(ejsTmp.filterTmp, filterCompViewModel(filterDefinition));
    }
}
