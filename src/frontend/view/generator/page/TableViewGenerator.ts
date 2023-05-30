import {TableViewDefinition} from "../../definition/page/TableViewDefinition";
import {compileEjsTmp} from "../../../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../../../ejsTmp/EjsTmp";
import {tableViewCompViewModel} from "../../../../utils/VueComponentUtils";

export class TableViewGenerator {
    static generate(tableViewDefinition: TableViewDefinition) {
        return compileEjsTmp(ejsTmp.tableViewTmp, tableViewCompViewModel(tableViewDefinition));
    }
}