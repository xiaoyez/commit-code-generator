import {DataColumnDefinition} from "../src/db/definition/DataColumnDefinition";
import {SqlType} from "../src/db/definition/SqlType";
import {TableCreateDefinition} from "../src/db/definition/TableCreateDefinition";
import {ObjectDefinitionUtils} from "../src/api/definition/ObjectDefinitionUtils";

const idDefinition = new DataColumnDefinition({
    isEnum: false,
    name: "id",
    nullable: false,
    typeName: SqlType.INT,
    isPrimaryKey: true,
    autoIncrement: true,
    length: 11,
});

const nameDefinition = new DataColumnDefinition({
    isEnum: undefined,
    name: "name",
    nullable: false,
    typeName: SqlType.VARCHAR,
    length: 20
});

const tableUserDefinition = new TableCreateDefinition({
    columns: [idDefinition, nameDefinition],
    comment: "用户表",
    tableName: "tb_user"
});

test('test castTableCreateDefinitionToObjectTypeDefinition',()=>{
    ObjectDefinitionUtils.castTableCreateDefinitionToObjectTypeDefinition(tableUserDefinition);
});