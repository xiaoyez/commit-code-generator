import {ViewUtils} from "../../src/frontend/view/definition/page/ViewUtils";
import {addMemberApi, deleteMemberApi, editMemberApi, getMemberInfoApi, getMemberListApi} from "./API";
import {FilterDefinition} from "../../src/frontend/view/definition/page/FilterDefinition";
import {
    ActBtn,
    ColActBtn,
    TableDefinition,
    TableViewDefinition
} from "../../src/frontend/view/definition/page/TableViewDefinition";
import {FormDialogDefinition, Rule} from "../../src/frontend/view/definition/page/FormDialogDefinition";
import {TbMemberAddDTODef} from "./DTO";
import {ObjectTypeDefinition} from "../../src/dto/definition/TypeDefinition";
import {IndexDefinition} from "../../src/frontend/view/definition/page/IndexDefinition";

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
            rule: Object.assign(Rule.idCardRule, {required: false}),
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
            disabledInEdit: false,
            labelKey: 'deptName',
        },
        userId: {
            disabledInEdit: false,
            labelKey: 'nickName',
        },
        introduceMemberId: {
            disabledInEdit: true,
            labelKey: 'realName'
        },
        label: {
            disabledInEdit: true,
        }

    }),
    infoApi: getMemberInfoApi,
    width: "950px",
    fileName: 'MemberFormDialog',
}

export const memberPage: IndexDefinition = {
    deleteApi: deleteMemberApi,
    filter: memberFilterDef,
    tableView: memberTableViewDef,
    formDialog: memberFormDialogDef,
    name: "member"
}
