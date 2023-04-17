import {ITypeDefinition, ObjectTypeDefinition, TypeDefinition} from "../../dto/definition/TypeDefinition";
import {config} from "../../config/Config";
import {JavaType} from "../../dto/definition/JavaType";

const tableDataInfo = new ObjectTypeDefinition({
    className: "TableDataInfo",
    packageName: `${config.projectPackage}.core.page`,
    properties: []
})

interface ITableDataInfoTypeDefinition {
    genericType?: ITypeDefinition;
}

export class TableDataInfoTypeDefinition extends TypeDefinition {
    constructor(props: ITableDataInfoTypeDefinition) {
        super({type: tableDataInfo, genericTypes: props.genericType ? [props.genericType] : undefined});
    }

    static createTableDataInfo(genericType: JavaType|ObjectTypeDefinition) {
        return new TableDataInfoTypeDefinition({genericType: {type: genericType}});
    }
}