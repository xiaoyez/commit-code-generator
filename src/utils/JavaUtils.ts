import {config} from "../config/Config";
import {getFullPackageName, PackageType} from "./PackageUtils";

/**
 * 获取java文件路径
 * @param packageName
 * @param className
 */
export function getJavaFilePath(packageName: string,className: string)
{
    return `${packageName.replace(/\./g, '\\')}\\${className}.java`;
}

/**
 * 获取domain包名
 * @param domainPackage
 */
export function getDomainPackage(domainPackage:string) {
    return getFullPackageName(PackageType.DOMAIN, domainPackage);
}

/**
 * 获取dto包名
 * @param dtoPackage
 */
export function getDtoPackage(dtoPackage:string) {
    return getFullPackageName(PackageType.DTO, dtoPackage);
}