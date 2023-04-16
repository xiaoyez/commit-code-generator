import {DataColumnDefinition} from "../src/db/definition/DataColumnDefinition";
import {SqlType} from "../src/db/definition/SqlType";
import {TableCreateDefinition} from "../src/db/definition/TableCreateDefinition";
import {ObjectTypeDefinitionUtils} from "../src/api/definition/ObjectTypeDefinitionUtils";
import {DTOGenerator} from "../src/api/generator/DTOGenerator";

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