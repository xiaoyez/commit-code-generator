import {config} from "../config/Config";

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
    return `${config.projectPackage}.${config.domainPackage}${domainPackage? '.' + domainPackage : ''}`;
}