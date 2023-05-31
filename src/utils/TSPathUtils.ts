import {config} from "../config/Config";
import {exist, mkdirs, writeStringToFile} from "./FileUtils";
import {
    getPackageTypeFromFullType,
    PackageType,
    SubPackageOfType
} from "./PackageUtils";

const frontSubPackage = new Map([
    [PackageType.DOMAIN, config.tsDataDef],
    [PackageType.DTO, config.tsDataDef],
    [PackageType.CONTROLLER, config.tsApiDef],
]);

/**
 * 转换包名为导入路径
 * @param fullModuleId
 */
export function convertModuleIdToImportPath(fullModuleId: string) {
    let packType = getPackageTypeFromFullType(fullModuleId);
    if (typeof packType !== 'number') {
        throw new Error(`特殊包名的导入路径不应该使用convertPackageToPath获取`);
    }
    let fePath = fullModuleId.replace(config.projectPackage, "@");

    if (frontSubPackage.has(packType)) {
        let packBase = SubPackageOfType.get(packType)!;
        fePath.replace(packBase, frontSubPackage.get(packType)!);
    }

    return fePath.replace(/\./g, '/');
}

/**
 * 转换包名为保存路径
 * @param fullModuleId
 * @param genIndex
 */
export function convertModuleIdToSavePath(fullModuleId: string, genIndex = false) {
    let fePath = convertModuleIdToImportPath(fullModuleId);

    let pathPackage: string;
    let fileName: string;
    if (genIndex) {
        pathPackage = fePath;
        fileName = 'index.ts';
    } else {
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
 * @param fullModuleId
 * @param genIndex
 */
export function saveToPath(content: string, fullModuleId: string, genIndex = false) {
    let {dirPath, fileName} = convertModuleIdToSavePath(fullModuleId, genIndex);
    let filePath = `${dirPath}\\${fileName}`;

    if (!exist(dirPath))
        mkdirs(dirPath);

    writeStringToFile(filePath, content);
}
