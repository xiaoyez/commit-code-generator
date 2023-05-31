import {config} from "../config/Config";
import {exist, mkdirs, writeStringToFile} from "./FileUtils";
import {getPackageTypeFromFullType, PackageType, SubPackageOfType} from "./PackageUtils";

const frontSubPackage = new Map([
    [PackageType.DOMAIN, config.tsDataDef],
    [PackageType.DTO, config.tsDataDef],
    [PackageType.CONTROLLER, config.tsApiDef],
]);

/**
 * 转换包名为路径
 * @param fullPackageName
 */
export function convertPackageToPath(fullPackageName: string) {
    let packType = getPackageTypeFromFullType(fullPackageName);
    if (packType === PackageType.CORE) {
        throw new Error(`core package 不应该在TSPathUtils中处理`);
    }
    let fePath = fullPackageName.replace(config.projectPackage, "@");
    let packBase = `@.${SubPackageOfType.get(packType)}`;
    if (frontSubPackage.has(packType)) {
        fePath.replace(packBase, `@.${frontSubPackage.get(packType)}`);
    }

    return fePath.replace(/\./g, '/');
}

/**
 * 转换包名为保存路径
 * @param fullPackageName
 * @param genIndex
 */
export function convertPackageToSavePath(fullPackageName: string, genIndex = false) {
    let fePath = convertPackageToPath(fullPackageName);

    let pathPackage: string;
    let fileName: string;
    if (genIndex) {
        pathPackage = fePath;
        fileName = 'index.ts';
    }
    else {
        let fileNameIdx = fePath.lastIndexOf('/');
        pathPackage = fePath.substring(0, fileNameIdx);
        fileName = `${fePath.substring(fileNameIdx + 1)}.ts`;
    }
    let basePath = `${config.baseDir}\\${config.frontRoot}`;
    let dirPath = pathPackage
        .replace(/\//g, '\\')
        .replace('@', basePath);


    return {
        dirPath,
        fileName,
    }
}

/**
 * 保存到路径(在对应路径下创建文件并写入内容)
 * @param content
 * @param packageName
 * @param genIndex
 */
export function saveToPath(content: string, packageName: string, genIndex = false) {
    let {dirPath, fileName} = convertPackageToSavePath(packageName, genIndex);
    let filePath = `${dirPath}\\${fileName}`;

    if (!exist(dirPath))
        mkdirs(dirPath);

    writeStringToFile(filePath, content);
}
