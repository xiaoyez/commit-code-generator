import {config} from "../config/Config";
import {exist, mkdirs, writeStringToFile} from "./FileUtils";

/**
 * 转换包名为路径
 * @param packageName
 */
export function convertPackageToPath(packageName: string) {
    let fePath = packageName.replace(config.projectPackage, "@");
    return fePath.replace(/\./g, '/');
}

/**
 * 转换包名为保存路径
 * @param packageName
 * @param subPath
 * @param genIndex
 */
export function convertPackageToSavePath(packageName: string, subPath = "", genIndex = false) {
    let fePath = packageName.replace(config.projectPackage, "");
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

/**
 * 保存到路径(在对应路径下创建文件并写入内容)
 * @param content
 * @param packageName
 * @param subPath
 * @param genIndex
 */
export function saveToPath(content: string, packageName: string, subPath = "", genIndex = false) {
    let {dirPath, fileName} = convertPackageToSavePath(packageName, subPath, genIndex);
    let filePath = `${dirPath}/${fileName}`;

    if (!exist(dirPath))
        mkdirs(dirPath);

    writeStringToFile(filePath, content);
}
