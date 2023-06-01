import {ViewUtils} from "../../src/frontend/view/definition/page/ViewUtils";
import {addMemberApi, editMemberApi, getMemberInfoApi, getMemberListApi} from "./API";
import {FilterDefinition} from "../../src/frontend/view/definition/page/FilterDefinition";
import {
    ActBtn,
    ColActBtn,
    TableDefinition,
    TableViewDefinition
} from "../../src/frontend/view/definition/page/TableViewDefinition";
import {DisplayType, FormDialogDefinition, Rule} from "../../src/frontend/view/definition/page/FormDialogDefinition";
import {TbMemberAddDTODef, TbMemberEditDTODef} from "./DTO";
import {ObjectTypeDefinition} from "../../src/dto/definition/TypeDefinition";

export const memberFilterDef: FilterDefinition = {
    fileName: "MemberFilter",
    filterFormDefinition: ViewUtils.castApiDefinitionToFilterFormDefinition(getMemberListApi),
    api: getMemberListApi
};

export const memberTableViewDef: TableViewDefinition = {
    actBtnArr: [ActBtn.ADD,ActBtn.EDIT,ActBtn.REMOVE,ActBtn.EXPORT],
    tableDef: ViewUtils.castApiDefinitionToTableDefinition(getMemberListApi) as TableDefinition,
    fileName: 'MemberTableView',
}

memberTableViewDef.tableDef.addActBtn(ColActBtn.EDIT, ColActBtn.INFO, ColActBtn.REMOVE);

const TbMemberAddDTOObjectTypeDef = TbMemberAddDTODef.type as ObjectTypeDefinition;

export const memberFormDialogDef: FormDialogDefinition = {
    addApi: addMemberApi,
    editApi: editMemberApi,
    formDefinition: ViewUtils.castApiDefinitionToDataFormDefinition(getMemberInfoApi, {
        realName: {
            rule: Rule.create(TbMemberAddDTOObjectTypeDef.findProperty('realName')!),
            disabledInEdit: false
        },
        idCardNum: {
            rule: Rule.idCardRule,
            disabledInEdit: false
        },
        gender: {
            disabledInEdit: false,
        },
        phoneNum: {
            rule: Rule.phoneNumberRule,
            disabledInEdit: false,
        },
        birthday: {
            disabledInEdit: false,
        },
        remark: {
            disabledInEdit: false,
        },
        deptId: {
            displayType: DisplayType.ADD,
            disabledInEdit: false,
        },
        userId: {
            displayType: DisplayType.ADD,
            disabledInEdit: false,
        },
        introduceMemberId: {
            disabledInEdit: true,
        },
        label: {
            disabledInEdit: true,
        }

    }),
    infoApi: getMemberInfoApi,
    width: "950px",
    fileName: 'MemberFormDialog',
}
