import {forEach} from "lodash";
import {JavaGeneratorUtils} from "../java/generator/utils/JavaGeneratorUtils";
import {JoinType} from "../db/definition/ViewCreateDefinition";
import {compileEjsTmp} from "./EjsUtils";

export interface EjsTmp {
    filePath: string;
    imports?: Record<string, any>;
    variable?: string;
}

export const ejsTmp = {
    javaClassTmp: {
        filePath: './src/ejsTmp/backend/ClassTemplate.ejs',
        imports: {
            forEach,
            JavaGeneratorUtils
        }
    },
    javaInterfaceTmp: {
        filePath: './src/ejsTmp/backend/InterfaceTemplate.ejs',
        imports: {
            forEach,
            JavaGeneratorUtils
        }
    },
    tableCreateSqlTmp: {
        filePath: './src/ejsTmp/backend/TableCreateSqlTemplate.ejs',
        imports: {
            forEach,
        }
    },
    viewCreateSqlTmp: {
        filePath: './src/ejsTmp/backend/ViewCreateSqlTemplate.ejs',
        imports: {
            forEach,
            JoinType,
        }
    },
    dbCreateSqlTmp: {
        filePath: './src/ejsTmp/backend/DbCreateSqlTemplate.ejs',
        imports: {}
    },
    ddlSqlGeneratorTmp: {
        filePath: './src/ejsTmp/backend/DDLSqlTemplate.ejs',
        imports: {
            forEach,
            JoinType,
            compileEjsTmp,
        }
    },
    javaConstantClassTmp: {
        filePath: './src/ejsTmp/backend/JavaConstantClassTemplate.ejs',
        imports: {
            forEach,
        }
    },
    dmlSqlGeneratorTmp: {
        filePath: './src/ejsTmp/backend/DMLSqlTemplate.ejs',
        imports: {
            forEach,
        }
    },
    tsEnumGenTmp: {
        filePath: './src/ejsTmp/frontend/TsEnumTemplate.ejs',
        variable: 'def',
    },
    tsEnumModuleTmp: {
        filePath: './src/ejsTmp/frontend/TsEnumModuleTemplate.ejs',
        imports: {
            compileEjsTmp,
        },
        variable: 'list',
    }
} satisfies Record<string, EjsTmp>;

let includeEjsTmp: (keyof typeof ejsTmp)[] = [
    'ddlSqlGeneratorTmp',
    'tsEnumModuleTmp',
];

for (let def of includeEjsTmp) {
    let tmpInfo: EjsTmp = ejsTmp[def];
    let imports = tmpInfo.imports ;
    if (!imports) {
        imports = tmpInfo.imports = {};
    }
    imports['ejsTmp'] = ejsTmp;
}