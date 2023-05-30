import {DataEnum} from "../../src/db/definition/DataEnum";

export const MemberStatus = new DataEnum({
    name: "MemberStatus",
    comment: "会员状态",
    options: [
        {
            value: 0,
            sign: "NORMAL",
            description: "正常会员"
        },
        {
            value: 1,
            sign: "PUB_SEA",
            description: "公海会员"
        },
        {
            value: 2,
            sign: "INVALID",
            description: "无效会员"
        },
    ],
    ruoyiDict:'ypx_member_status',
    package: "",

})