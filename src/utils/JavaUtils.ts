import {config} from "../config/Config";

export function getJavaFilePath(packageName: string,className: string)
{
    return `${packageName.replace(/\./g, '\\')}\\${className}.java`;
}

export function getDomainPackage(domainPackage:string) {
    return `${config.basePackage}.${config.domainPackage}${domainPackage? '.' + domainPackage : ''}`;
}