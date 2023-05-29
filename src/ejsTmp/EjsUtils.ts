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

interface TemplateOptions {
    indent?: number;
}

export function compileEjsTmp(ejsTmp: EjsTmp, data: object, options?: TemplateOptions) {
    const ejsFunc = getEjsFunc(ejsTmp);
    let res = ejsFunc(data);
    if (options?.indent && options.indent > 0) {
        let indent = ' '.repeat(options.indent);
        res = res.split('\n').map(line => indent + line).join('\n');
    }
    return res;
}