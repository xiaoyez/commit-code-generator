import {SqlType} from "../../src/db/definition/SqlType";
import {TableCreateDefinition} from "../../src/db/definition/TableCreateDefinition";
import {DataColumnDefinition} from "../../src/db/definition/DataColumnDefinition";
import {MemberStatusEnumDef} from "./enums";
import {DbDefinition} from "../../src/db/definition/DbDefinition";

/**
 * 会员表的定义
 */
export const tbMemberTableDef = new TableCreateDefinition({
    tableName: "tb_member",
    comment: "会员表",
    columns: {
        id: new DataColumnDefinition({
            name: "id",
            comment: "",
            typeName: SqlType.INT,
            length: 11,
            isPrimaryKey: true,
            autoIncrement: true,
            nullable: false,
            isEnum: false
        }),
        memberNum: new DataColumnDefinition({
            name: "member_num",
            comment: "会员编号",
            typeName: SqlType.VARCHAR,
            length: 255,
            nullable: true,
        }),
        realName: new DataColumnDefinition({
            name: "real_name",
            comment: "会员姓名",
            typeName: SqlType.VARCHAR,
            length: 255,
            nullable: true,
        }),
        idCardNum: new DataColumnDefinition({
            name: "id_card_num",
            comment: "身份证号",
            typeName: SqlType.CHAR,
            length: 18,
            nullable: true,
        }),
        gender: new DataColumnDefinition({
            name: 'gender',
            comment: '性别',
            typeName: SqlType.VARCHAR,
            length: 255,
            nullable: true,
        }),
        avatar: new DataColumnDefinition({
            name: 'avatar',
            comment: '头像',
            typeName: SqlType.TEXT,
            nullable: true,
        }),
        phoneNum: new DataColumnDefinition({
            name: 'phone_num',
            comment: '联系电话',
            typeName: SqlType.CHAR,
            length: 11,
            nullable: true,
        }),
        level: new DataColumnDefinition({
            name: 'level',
            comment: '会员等级',
            typeName: SqlType.INT,
            length: 2,
            nullable: true,
            isEnum: false,
            defaultValue: '1',
        }),
        birthday: new DataColumnDefinition({
            name: 'birthday',
            comment: '会员生日',
            typeName: SqlType.DATE,
            nullable: true,
        }),
        description: new DataColumnDefinition({
            name: 'description',
            comment: '描述',
            typeName: SqlType.VARCHAR,
            length: 255,
            nullable: true,
        }),
        remark: new DataColumnDefinition({
            name: 'remark',
            comment: '备注',
            typeName: SqlType.VARCHAR,
            length: 255,
            nullable: true,
        }),
        deptId: new DataColumnDefinition({
            name: 'dept_id',
            comment: '所属门店',
            typeName: SqlType.INT,
            length: 11,
            nullable: true,
            isEnum: false,
        }),
        userId: new DataColumnDefinition({
            name: 'user_id',
            comment: '所属业务员',
            typeName: SqlType.INT,
            length: 11,
            nullable: true,
            isEnum: false,
        }),
        password: new DataColumnDefinition({
            name: 'password',
            comment: '密码',
            typeName: SqlType.VARCHAR,
            length: 255,
            nullable: true,
        }),
        wxOpenid: new DataColumnDefinition({
            name: 'wx_openid',
            comment: '微信openid',
            typeName: SqlType.VARCHAR,
            length: 255,
            nullable: true,
        }),
        introduceMemberId: new DataColumnDefinition({
            name: 'introduce_member_id',
            comment: '介绍人id',
            typeName: SqlType.INT,
            length: 11,
            nullable: true,
            isEnum: false,
        }),
        point: new DataColumnDefinition({
            name: 'point',
            comment: '积分',
            typeName: SqlType.INT,
            length: 11,
            nullable: true,
            isEnum: false,
            defaultValue: '0',
        }),
        status: new DataColumnDefinition({
            name: 'status',
            comment: '会员状态',
            typeName: SqlType.INT,
            length: 1,
            nullable: true,
            isEnum: true,
            enumType: MemberStatusEnumDef,
            defaultValue: '1',
        }),
        toSeaTime: new DataColumnDefinition({
            name: 'to_sea_time',
            comment: '转入公海时间',
            typeName: SqlType.DATETIME,
            nullable: true,
        }),
        toSeaReason: new DataColumnDefinition({
            name: 'to_sea_reason',
            comment: '转入公海原因',
            typeName: SqlType.VARCHAR,
            length: 200,
            nullable: true,
        }),
        invalidTime: new DataColumnDefinition({
            name: 'invalid_time',
            comment: '标记无效时间',
            typeName: SqlType.DATETIME,
            nullable: true,
        }),
        invalidReason: new DataColumnDefinition({
            name: 'invalid_reason',
            comment: '标记无效原因',
            typeName: SqlType.VARCHAR,
            length: 200,
            nullable: true,
        }),
    }
});

export const testDbDef = new DbDefinition({
    dbName: "test",
    tables: [tbMemberTableDef],
    views: [],
})
