import {FilterDefinition} from "../definition/page/FilterDefinition";
import {compileEjsTmp} from "../../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../../ejsTmp/EjsTmp";
import {TableViewDefinition} from "../definition/page/TableViewDefinition";
import {FormDialogDefinition} from "../definition/page/FormDialogDefinition";
import {
    commonPageViewModel,
    filterCompViewModel,
    formDialogViewModel,
    tableViewCompViewModel
} from "../../../utils/VueComponentUtils";
import {IndexDefinition} from "../definition/page/IndexDefinition";

export class PageGenerator {
    static generateFilter(filterDefinition: FilterDefinition) {
        return compileEjsTmp(ejsTmp.filterTmp, filterCompViewModel(filterDefinition))
    }

    static generateTableView(tableViewDefinition: TableViewDefinition) {
        return compileEjsTmp(ejsTmp.tableViewTmp, tableViewCompViewModel(tableViewDefinition));
    }

    static generateFormDialog(formDialogDefinition: FormDialogDefinition) {
        return compileEjsTmp(ejsTmp.formDialogTmp, formDialogViewModel(formDialogDefinition));
    }

    static generateIndexPageContent(indexDefinition: IndexDefinition) {
        return compileEjsTmp(ejsTmp.pageIndexTmp, commonPageViewModel(indexDefinition));
    }
}