import {config} from "../config/Config";

export enum PackageType {
    CORE,
    DOMAIN,
    DTO,
    MAPPER,
    CONSTANT,
    CONTROLLER,
    SERVICE,
}

const specialDTO = new Set([
    'AjaxResult',
    'TableDataInfo',
]);

export const SubPackageOfType = new Map([
    [PackageType.DOMAIN, config.domainPackage],
    [PackageType.DTO, `${config.dtoPackage}.${config.dtoPackage}`],
    [PackageType.MAPPER,config.mapperPackage],
    [PackageType.CONSTANT, config.constantPackage],
    [PackageType.CONTROLLER, config.controllerPackage],
    [PackageType.SERVICE, config.servicePackage],
]);

const isSuffixPackage = new Set([
    PackageType.CONTROLLER,
    PackageType.SERVICE,
]);

export function getFullPackageName(defType: PackageType, packageName?: string) {
    let base = config.projectPackage;
    if (!isSuffixPackage.has((defType))) {
        base += `.${SubPackageOfType.get(defType)}`;
    }
    let res = packageName ? `${base}.${packageName}` : base;
    if (isSuffixPackage.has(defType)) {
        res += `.${SubPackageOfType.get(defType)}`;
    }
    return res;
}

const matchOrder = [...SubPackageOfType]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([key]) => key);

export function getPackageTypeFromFullType(fullType: string) {
    if (fullType.startsWith(config.projectPackage)) {
        fullType = fullType.substring(config.projectPackage.length + 1);
        for (let type of matchOrder) {
            if (fullType.startsWith(SubPackageOfType.get(type)!)) {
                return type;
            }
        }
    }
    return PackageType.CORE;
}
