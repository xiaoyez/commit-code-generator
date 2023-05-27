import {
    FilterDefinition,
    FilterFormDefinition,
    FilterFormItemDefinition,
} from "../../definition/page/FilterDefinition";
import {
    DateInputControl,
    DictSelectInputControl,
    InputControl, SelectInputControl, TextInputControl
} from "../../definition/page/FormDefinition";
import {ObjectTypeDefinition} from "../../../../dto/definition/TypeDefinition";
import {generateImportLines, getTypeImportsFrom} from "../../../../utils/TSImportUtils";
import {compileEjsTmp} from "../../../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../../../ejsTmp/EjsTmp";

type InputControlTempGen = (modelName: string, def: InputControl) => string;

export class FilterGenerator {

    static generate(filterDefinition: FilterDefinition) {
        return compileEjsTmp(ejsTmp.filterTmp, filterDefinition)
    }
}
