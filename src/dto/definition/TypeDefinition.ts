import {JavaType} from "./JavaType";
import {TimePattern} from "./TimePattern";
import {DataEnum} from "../../db/definition/DataEnum";
import {TableCreateDefinition} from "../../db/definition/TableCreateDefinition";
import {DataColumnDefinition} from "../../db/definition/DataColumnDefinition";


export interface IPropertyDefinition {
    /**
     * 参数名称。
     */
    paramName: string;

    /**
     * 参数类型。
     */
    paramType: TypeDefinition;

    /**
     * 枚举类型
     */
    enumType?: DataEnum;

    /**
     * 参数描述。
     */
    paramDesc?: string;

    timePattern?: TimePattern;


    /**
     * 是否为外键
     */
    foreignKey?: boolean;

    /**
     * 外键对应的表
     */
    referenceTable?: TableCreateDefinition;

    /**
     * 外键对应的列
     */
    referenceColumn?: string| DataColumnDefinition;
}

export interface IDomainPropertyDefinition extends IPropertyDefinition {
    isPrimaryKey: boolean;
    autoIncrement: boolean;
}

interface IObjectTypeDefinition {

    properties: IPropertyDefinition[];

    className: string;

    packageName?: string;
}

export class ObjectTypeDefinition implements IObjectTypeDefinition {
    properties!: IPropertyDefinition[];
    className!: string;
    packageName!: string;

    constructor(props: IObjectTypeDefinition) {
        Object.assign(this, props);
    }

    static create(className: string, packageName: string, properties: IPropertyDefinition[]) {
        return new ObjectTypeDefinition({className, packageName, properties});
    }
}

interface IDomainTypeDefinition extends IObjectTypeDefinition {
    properties: IDomainPropertyDefinition[];
    comment?: string;
}

export class DomainTypeDefinition extends ObjectTypeDefinition {
    properties!: IDomainPropertyDefinition[];
    comment?: string;

    constructor(props: IDomainTypeDefinition) {
        super(props);
    }

    static create(className: string, packageName: string, properties: IDomainPropertyDefinition[], comment?: string) {
        return new DomainTypeDefinition({className, packageName, properties, comment});
    }
}

export interface ITypeDefinition {
    type: JavaType|ObjectTypeDefinition;
    genericTypes?: ITypeDefinition[];

}

export class TypeDefinition implements ITypeDefinition {
    type!: JavaType|ObjectTypeDefinition;
    genericTypes?: TypeDefinition[];

    constructor(props: ITypeDefinition) {
        Object.assign(this, props);
        if (props.genericTypes) {
            this.genericTypes = props.genericTypes.map(def => {
                if (def instanceof TypeDefinition) {
                    return def;
                }
                else {
                    return new TypeDefinition(def);
                }
            });
        }
    }

    static create(type: JavaType|ObjectTypeDefinition, genericTypes?: TypeDefinition[]) {
        return new TypeDefinition({type, genericTypes});
    }

}