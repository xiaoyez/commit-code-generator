import {DDLSqlGenerator} from "../src/db/generator/DDLSqlGenerator";
import {DataColumnDefinition} from "../src/db/definition/DataColumnDefinition";
import {SqlType} from "../src/db/definition/SqlType";
import {TableCreateDefinition} from "../src/db/definition/TableCreateDefinition";
import {DbDefinition} from "../src/db/definition/DbDefinition";
import {JoinType, ViewCreateDefinition} from "../src/db/definition/ViewCreateDefinition";
import {DataEnum} from "../src/db/definition/DataEnum";
import {DataEnumOption} from "../src/db/definition/DataEnumOption";

const idDefinition = new DataColumnDefinition({
    isEnum: false,
    name: "id",
    nullable: false,
    typeName: SqlType.INT,
    isPrimaryKey: true,
    autoIncrement: true,
    length: 11,
    comment: "主键"
});

const nameDefinition = new DataColumnDefinition({
    isEnum: undefined,
    name: "name",
    nullable: false,
    typeName: SqlType.VARCHAR,
    length: 20,
    comment: "名称"
});

const dataEnum = new DataEnum({
    name: "AuditStatusConstant",
    package: "com.cgmanage.web.modules.ypx.constants",
    options: [
        new DataEnumOption({
            description: "审核中",
            sign: "AUDITING",
            value: 1
        }),
        new DataEnumOption({
            description: "通过",
            sign: "PASS",
            value: 2
        }),new DataEnumOption({
            description: "拒绝",
            sign: "REJECT",
            value: 3
        }),
    ],

})

const statusEnumDefinition = new DataColumnDefinition({
    isEnum: true,
    name: "status",
    nullable: false,
    typeName: SqlType.INT,
    length: 11,
    enumType: dataEnum,
    comment: "状态"
});

export const tableUserDefinition = new TableCreateDefinition({
    columns: [idDefinition, nameDefinition, statusEnumDefinition],
    comment: "用户表",
    tableName: "tb_user"
});

const dbDefinition = new DbDefinition({
    dbName: "ypx", tables: [tableUserDefinition, tableUserDefinition]

});


test('test generateCreateColumnSql', () => {
    console.log(DDLSqlGenerator.generateCreateColumnSql(idDefinition));
});

test('test generateCreateTableSql', () => {
    console.log(DDLSqlGenerator.generateCreateTableSql(tableUserDefinition));
});

test('test generateCreateDbSql', () => {
    console.log(DDLSqlGenerator.generateCreateDbSql(dbDefinition));
});

test('test generateSql', () => {
    console.log(DDLSqlGenerator.generateSql(dbDefinition));
});


// 测试view用的测试数据

const nameCol = new DataColumnDefinition({
    isEnum: undefined,
    name: "name",
    nullable: false,
    typeName: SqlType.VARCHAR,
    length: 255,
    comment: '商品名称',
})
const imgUrlCol = new DataColumnDefinition({
    isEnum: undefined,
    name: "img_url",
    nullable: false,
    typeName: SqlType.VARCHAR,
    length: 255,
    comment: '商品图片',
})
const
TbCommodityTable = new TableCreateDefinition({
    tableName: 'tb_commodity',
    columns: [
        new DataColumnDefinition({
            isEnum: false,
            name: "id",
            nullable: false,
            typeName: SqlType.INT,
            length: 11,
            comment: '主键',
            isPrimaryKey: true,
            autoIncrement: true,
        }),
        new DataColumnDefinition({
            isEnum: undefined,
            name: "number",
            nullable: false,
            typeName: SqlType.VARCHAR,
            length: 255,
            comment: '商品编号',
        }),
        nameCol,
        imgUrlCol
    ],
    comment: '商品表'
})

const TbOrderItemTable = new TableCreateDefinition({
    tableName: "tb_order_item",
    comment: "订单商品项表",
    columns: [
        new DataColumnDefinition({
            isEnum: false,
            name: "id",
            nullable: false,
            typeName: SqlType.INT,
            length: 11,
            comment: '主键',
            isPrimaryKey: true,
            autoIncrement: true,
        }),
        new DataColumnDefinition({
            isEnum: false,
            name: "order_id",
            nullable: false,
            typeName: SqlType.INT,
            length: 11,
            comment: '订单id',
        }),
        new DataColumnDefinition({
            isEnum: false,
            name: "product_id",
            nullable: false,
            typeName: SqlType.INT,
            length: 11,
            comment: '商品id',
        }),

    ],

});

const viewOrderItem = new ViewCreateDefinition({
    name: "view_order_item",
    items: [
        {
            table: TbOrderItemTable,
            alias: 'toi',
            cols: [{col: '*',}],
            joinType: JoinType.FROM
        },
        {
            table: TbCommodityTable,
            alias: 'tc',
            cols: [
                {col:nameCol,alias:'productName'},
                {col:imgUrlCol, alias: 'productImg'}
            ],
            joinType: JoinType.LEFT_JOIN,
            on: 'tc.id = toi.product_id'
        }
    ]

});

test('test 根据ViewCreateDefinition生成创建视图的sql', ()=>{
    console.log(DDLSqlGenerator.generateCreateViewSql(viewOrderItem))
})