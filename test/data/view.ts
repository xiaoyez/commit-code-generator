import {ViewUtils} from "../../src/frontend/view/definition/page/ViewUtils";
import {addMemberApi, editMemberApi, getMemberInfoApi, getMemberListApi} from "./API";
import {FilterDefinition} from "../../src/frontend/view/definition/page/FilterDefinition";
import {
    ActBtn,
    ColActBtn,
    TableDefinition,
    TableViewDefinition
} from "../../src/frontend/view/definition/page/TableViewDefinition";
import {FormDialogDefinition} from "../../src/frontend/view/definition/page/FormDialogDefinition";

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

export const memberFormViewDef: FormDialogDefinition = {
    addApi: addMemberApi,
    editApi: editMemberApi,
    formDefinition: {
        items: ViewUtils.castApiDefinitionToDataFormDefinition(getMemberListApi, {

        }).items
    },
    infoApi: getMemberInfoApi,
    width: "950px"
}
