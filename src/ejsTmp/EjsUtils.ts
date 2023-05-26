import {EjsTmp} from "./EjsTmp";
import {template} from "lodash";
import {readFile} from "../utils/FileUtils";

let ejsFuncs = new WeakMap<EjsTmp, ReturnType<typeof template>>();

function getEjsFunc(ejsTmp: EjsTmp) {
    if (!ejsFuncs.has(ejsTmp)) {
        const tmpStr = readFile(ejsTmp.filePath);
        ejsFuncs.set(ejsTmp, template(tmpStr, {
            imports: ejsTmp.imports,
            variable: ejsTmp.variable,
        }));
    }
    return ejsFuncs.get(ejsTmp)!;
}

export function compileEjsTmp(ejsTmp: EjsTmp, data: any) {
    const ejsFunc = getEjsFunc(ejsTmp);
    return ejsFunc(data);
}