import {config} from "../config/Config";

export interface TSImportInfo {
    importPath: string;
    importName: string;
}

export function convertPackageToPath(packageName: string) {
    let fePath = packageName.replace(config.basePackage, "@");
    return fePath.replace(/\./g, '/');
}

export function convertPackageToSavePath(packageName: string, subPath = "", genIndex = false) {
    let fePath = packageName.replace(config.basePackage, "");

    let pathPackage: string;
    let fileName: string;
    if (genIndex) {
        pathPackage = fePath;
        fileName = 'index.ts';
    }
    else {
        let fileNameIdx = fePath.lastIndexOf('.');
        pathPackage = fePath.substring(0, fileNameIdx);
        fileName = `${fePath.substring(fileNameIdx + 1)}.ts`;
    }
    let basePath = config.baseDir;
    if (subPath) {
        basePath = `${basePath}\\${subPath}`;
    }
    let dirPath = basePath + pathPackage.replace(/\./g, '/');

    return {
        dirPath,
        fileName,
    }
}