import {config} from "../config/Config";

// 生成内容的类型
export enum PackageType {
    DOMAIN,
    DTO,
    MAPPER,
    CONSTANT,
    CONTROLLER,
    SERVICE,
    COMPONENT,
}

// 不同类型生成内容的子包名
export const SubPackageOfType = new Map([
    [PackageType.DOMAIN, config.domainPackage],
    [PackageType.DTO, `${config.domainPackage}.${config.dtoPackage}`],
    [PackageType.MAPPER,config.mapperPackage],
    [PackageType.CONSTANT, config.constantPackage],
    [PackageType.CONTROLLER, config.controllerPackage],
    [PackageType.SERVICE, config.servicePackage],
    [PackageType.COMPONENT, `${config.compPackage}.${config.projectName}`],
]);

// 将不同内容类型的包id转换为完整包名
export function getFullPackageName(defType: PackageType, packageName?: string) {
    let base = `${config.projectPackage}.${SubPackageOfType.get(defType)}`;
    return packageName ? `${base}.${packageName}` : base;
}

// 完整包名的匹配顺序从长到短，较长子包名优先匹配，处理子包名有嵌套层级的情况
const matchOrder = [...SubPackageOfType]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([key]) => key);

// 根据完整包名，匹配对应的生成内容类型
export function getPackageTypeFromFullType(fullType: string) {
    if (fullType.startsWith(config.projectPackage)) {
        fullType = fullType.substring(config.projectPackage.length + 1);
        for (let type of matchOrder) {
            if (fullType.startsWith(SubPackageOfType.get(type)!)) {
                return type;
            }
        }
    }
    return null;
}
