import {DataColumnDefinition} from "../src/db/definition/DataColumnDefinition";
import {SqlType} from "../src/db/definition/SqlType";
import {TableCreateDefinition} from "../src/db/definition/TableCreateDefinition";
import {ObjectTypeDefinitionUtils} from "../src/dto/definition/ObjectTypeDefinitionUtils";
import {DTOGenerator} from "../src/dto/generator/DTOGenerator";
import {JoinType, ViewCreateDefinition} from "../src/db/definition/ViewCreateDefinition";
import {generateInterfaceDefine} from "../src/dto/generator/TSInterfaceGenerator";

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
    comment: "姓名"
});

const createTimeDefinition = new DataColumnDefinition({
    name: "create_time",
    nullable: false,
    typeName: SqlType.DATETIME,
    comment: "创建时间"
});

const tableUserDefinition = new TableCreateDefinition({
    columns: [idDefinition, nameDefinition,createTimeDefinition],
    comment: "用户表",
    tableName: "tb_user"
});

test('test castTableCreateDefinitionToObjectTypeDefinition',()=>{
    console.log(ObjectTypeDefinitionUtils.castTableCreateDefinitionToObjectTypeDefinition(tableUserDefinition));
});

test('test 根据TableCreateDefinition经过ObjectTypeDefinition生产java文件',()=>{
    const domainTypeDefinition = ObjectTypeDefinitionUtils.castTableCreateDefinitionToDomainTypeDefinition(tableUserDefinition);
    DTOGenerator.generateDomain(domainTypeDefinition);
})

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
const TbCommodityTable = new TableCreateDefinition({
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
    comment: '订单商品项视图',
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

test('test castViewCreateDefinitionToObjectTypeDefinition',()=>{
    console.log(ObjectTypeDefinitionUtils.castViewCreateDefinitionToDomainTypeDefinition(viewOrderItem));
})

test('test 根据ViewCreateDefinition经过ObjectTypeDefinition生产java文件',()=>{
    const domainTypeDefinition = ObjectTypeDefinitionUtils.castViewCreateDefinitionToDomainTypeDefinition(viewOrderItem);
    DTOGenerator.generateDomain(domainTypeDefinition);
})

test('test 根据ViewCreateDefinition经过ObjectTypeDefinition生产ts interface',()=>{
    const domainTypeDefinition = ObjectTypeDefinitionUtils.castViewCreateDefinitionToDomainTypeDefinition(viewOrderItem);
    console.log(generateInterfaceDefine(domainTypeDefinition))
})