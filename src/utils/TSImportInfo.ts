import {config} from "../config/Config";

export interface TSImportInfo {
    importPath: string;
    importName: string;
}

export function convertPackageToPath(packageName: string) {
    let fePath = packageName.replace(config.basePackage, "@");
    return fePath.replace(/\./g, '/');
}