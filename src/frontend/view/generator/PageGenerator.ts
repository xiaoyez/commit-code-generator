import {FilterDefinition} from "../definition/page/FilterDefinition";
import {compileEjsTmp} from "../../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../../ejsTmp/EjsTmp";
import {TableViewDefinition} from "../definition/page/TableViewDefinition";
import {FormDialogDefinition} from "../definition/page/FormDialogDefinition";
import {filterCompViewModel, tableViewCompViewModel} from "../../../utils/VueComponentUtils";

export class PageGenerator {
    static generateFilter(filterDefinition: FilterDefinition) {
        return compileEjsTmp(ejsTmp.filterTmp, filterCompViewModel(filterDefinition))
    }

    static generateTableView(tableViewDefinition: TableViewDefinition) {
        return compileEjsTmp(ejsTmp.tableViewTmp, tableViewCompViewModel(tableViewDefinition));
    }

    static generateFormDialog(formDialogDefinition: FormDialogDefinition) {
        return compileEjsTmp(ejsTmp.formDialogTmp, formDialogDefinition);
    }
}