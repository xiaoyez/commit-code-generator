import {forEach, join, map} from "lodash";
import {JavaGeneratorUtils} from "../java/generator/utils/JavaGeneratorUtils";
import * as console from "console";

export interface EjsTmp {
    filePath: string,
    imports: any
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
            map,
            join,
        }
    }
} satisfies Record<string, EjsTmp>;