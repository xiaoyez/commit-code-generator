import {forEach} from "lodash";
import {JavaGeneratorUtils} from "../java/generator/utils/JavaGeneratorUtils";
import {JoinType} from "../db/definition/ViewCreateDefinition";
import {compileEjsTmp} from "./EjsUtils";
import {fieldTypeString} from "../utils/TypeUtils";
import {DateInputControl, SelectInputControl, TextInputControl} from "../frontend/view/definition/page/FormDefinition";
import {generateImportLines, getTypeImportsFrom} from "../utils/TSImportUtils";
import {ObjectTypeDefinition} from "../dto/definition/TypeDefinition";
import {ActBtn, ColActBtn, TableColType} from "../frontend/view/definition/page/TableViewDefinition";
import {ModuleUtils} from "../api/utils/ModuleUtils";
import {ApiUtils} from "../api/utils/ApiUtils";
import {tsTypeString} from "../utils/TypeUtils";

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
    },
    tsInterfaceGenTmp: {
        filePath: './src/ejsTmp/frontend/TsInterfaceTemplate.ejs',
        imports: {
            fieldTypeString,
        }
    },
    tsImportLinesTmp: {
        filePath: './src/ejsTmp/frontend/TsImportLinesTemplate.ejs',
        variable: 'importDefs',
    },
    filterTmp: {
        filePath: './src/ejsTmp/frontend/view/FilterTemplate.ejs',
        imports: {
            forEach,
            TextInputControl,
            SelectInputControl,
            DateInputControl,
            getTypeImportsFrom,
            generateImportLines,
            ObjectTypeDefinition,
        },
        variable: 'def',
    },
    tableViewTmp: {
        filePath: './src/ejsTmp/frontend/view/TableViewTemplate.ejs',
        imports: {
            forEach,
            ActBtn,
            prefix2Module: ModuleUtils.prefix2Module,
            ApiUtils,
            TableColType,
            ColActBtn,
            getTypeImportsFrom,
            generateImportLines,
            tsTypeString,
        }
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