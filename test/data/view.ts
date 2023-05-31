import {ViewUtils} from "../../src/frontend/view/definition/page/ViewUtils";
import {getMemberListApi} from "./API";
import {FilterDefinition} from "../../src/frontend/view/definition/page/FilterDefinition";
import {
    ActBtn,
    ColActBtn,
    TableDefinition,
    TableViewDefinition
} from "../../src/frontend/view/definition/page/TableViewDefinition";

export const memberFilterDef: FilterDefinition = {
    fileName: "MemberFilter",
    filterFormDefinition: ViewUtils.castApiDefinitionToFilterFormDefinition(getMemberListApi),
    api: getMemberListApi
};

export const memberTableViewDef: TableViewDefinition = {
    actBtnArr: [ActBtn.ADD,ActBtn.EDIT,ActBtn.REMOVE,ActBtn.EXPORT],
    tableDef: ViewUtils.castApiDefinitionToTableDefinition(getMemberListApi) as TableDefinition
}

memberTableViewDef.tableDef.addActBtn(ColActBtn.EDIT, ColActBtn.INFO, ColActBtn.REMOVE);