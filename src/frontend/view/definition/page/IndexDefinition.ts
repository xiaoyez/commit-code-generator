import {FilterDefinition} from "./FilterDefinition";
import {TableViewDefinition} from "./TableViewDefinition";
import {FormDialogDefinition} from "./FormDialogDefinition";
import {ApiDefinition} from "../../../../api/definition/ApiDefinition";

export interface IndexDefinition {
    filter: FilterDefinition,
    tableView: TableViewDefinition,
    formDialog: FormDialogDefinition,
    name: string,
    deleteApi?: ApiDefinition,
}