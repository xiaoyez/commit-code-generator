import {forEach, kebabCase, upperFirst} from "lodash";
import {JavaGeneratorUtils} from "../java/generator/utils/JavaGeneratorUtils";
import {JoinType} from "../db/definition/ViewCreateDefinition";
import {compileEjsTmp} from "./EjsUtils";
import {fieldTypeString} from "../utils/TypeUtils";
import {generateImportLines, getTypeImportsFrom} from "../utils/TSImportUtils";
import {ActBtn, ColActBtn, TableColType} from "../frontend/view/definition/page/TableViewDefinition";
import {ModuleUtils, prefix2Module} from "../api/utils/ModuleUtils";
import {ApiUtils} from "../api/utils/ApiUtils";
import {tsTypeString} from "../utils/TypeUtils";
import {
    DateInputControl,
    DictSelectInputControl,
    SelectInputControl,
    TextInputControl
} from "../frontend/view/definition/page/FormDefinition";

export interface EjsTmp {
    filePath: string;
    imports?: Record<string, any>;
    variable?: string;
    needOtherTmp?: boolean;
}

export const ejsTmp = {
    javaClassTmp: {
        filePath: './src/ejsTmp/backend/ClassTemplate.ejs',
        imports: {
            forEach,
            JavaGeneratorUtils
        },
        variable: 'def',
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
        },
        needOtherTmp: true,
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
        filePath: './src/ejsTmp/frontend/EnumTemplate.ejs',
        variable: 'def',
    },
    tsEnumModuleTmp: {
        filePath: './src/ejsTmp/frontend/EnumModuleTemplate.ejs',
        variable: 'list',
        needOtherTmp: true,
    },
    tsInterfaceGenTmp: {
        filePath: './src/ejsTmp/frontend/InterfaceTemplate.ejs',
        imports: {
            fieldTypeString,
        }
    },
    tsImportLinesTmp: {
        filePath: './src/ejsTmp/frontend/ImportLinesTemplate.ejs',
        variable: 'importDefs',
    },
    tsInterfaceModuleTmp: {
        filePath: './src/ejsTmp/frontend/InterfaceModuleTemplate.ejs',
        variable: 'data',
        needOtherTmp: true,
    },
    tsApiCallFuncTmp: {
        filePath: './src/ejsTmp/frontend/ApiCallFuncTemplate.ejs',
        imports: {
            tsTypeString,
        }
    },
    tsApiModuleTmp: {
        filePath: './src/ejsTmp/frontend/ApiCallModuleTemplate.ejs',
        variable: 'data',
        needOtherTmp: true,
    },
    filterTmp: {
        filePath: './src/ejsTmp/frontend/view/FilterTemplate.ejs',
        imports: {
            forEach,
        },
        needOtherTmp: true,
    },
    filterTextControlTmp: {
        filePath: './src/ejsTmp/frontend/view/inputControl/textInputTemplate.ejs',
    },
    filterSelectControlTmp: {
        filePath: './src/ejsTmp/frontend/view/inputControl/selectInputTemplate.ejs',
    },
    filterDateControlTmp: {
        filePath: './src/ejsTmp/frontend/view/inputControl/datePickerTemplate.ejs',
        variable: 'info',
    },
    tableViewTmp: {
        filePath: './src/ejsTmp/frontend/view/TableViewTemplate.ejs',
        imports: {
            forEach,
            TableColType,
        },
        needOtherTmp: true,
    },
    formDialogTmp: {
        filePath: './src/ejsTmp/frontend/view/FormDialogTemplate.ejs',
        imports: {
            forEach,
            ModuleUtils,
            ApiUtils,
            getTypeImportsFrom,
            generateImportLines,
            SelectInputControl,
            TextInputControl,
            DictSelectInputControl,
            DateInputControl,
        }
    },
    pageIndexTmp: {
        filePath: './src/ejsTmp/frontend/view/indexTemplate.ejs',
        imports: {
            forEach,
            kebabCase,
            ActBtn,
            upperFirst,
        },
        needOtherTmp: true,
    }
} satisfies Record<string, EjsTmp>;

for (let def in ejsTmp) {
    let tmpInfo: EjsTmp = ejsTmp[def as keyof typeof ejsTmp];
    if (tmpInfo.needOtherTmp) {
        let imports = tmpInfo.imports ;
        if (!imports) {
            imports = tmpInfo.imports = {};
        }
        imports['ejsTmp'] = ejsTmp;
        imports['compileEjsTmp'] = compileEjsTmp;
    }
}