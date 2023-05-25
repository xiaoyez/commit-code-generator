import {EjsTmp} from "./EjsTmp";
import {template} from "lodash";
import {readFile} from "../utils/FileUtils";

export function compileEjsTmp(ejsTmp: EjsTmp, data: any) {
    const tmpStr = readFile(ejsTmp.filePath);
    return template(tmpStr, {imports: ejsTmp.imports})(data);
}