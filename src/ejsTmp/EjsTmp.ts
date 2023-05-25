import {forEach} from "lodash";
import {JavaGeneratorUtils} from "../java/generator/utils/JavaGeneratorUtils";

interface EjsTmp {
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
} satisfies Record<string, EjsTmp>;