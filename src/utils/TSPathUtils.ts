import {config} from "../config/Config";
import {exist, mkdirs, writeStringToFile} from "./FileUtils";

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
    if (!fePath.startsWith('.')) {
        fePath = '.' + fePath;
    }

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

export function saveToPath(content: string, packageName: string, subPath = "", genIndex = false) {
    let {dirPath, fileName} = convertPackageToSavePath(packageName, subPath, genIndex);
    let filePath = `${dirPath}/${fileName}`;

    if (!exist(dirPath))
        mkdirs(dirPath);

    writeStringToFile(filePath, content);
}
