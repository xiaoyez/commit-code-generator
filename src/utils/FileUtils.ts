import * as fs from "fs";

/**
 * 判断文件是否存在
 * @param path
 */
export function exist(path: string) {
    return fs.existsSync(path);
}

/**
 * 创建文件夹
 * @param dirPath
 */
export function mkdirs(dirPath: string) {
    fs.mkdirSync(dirPath, {recursive: true})
}

/**
 * 写入文件
 * @param filePath
 * @param content
 */
export function writeStringToFile(filePath: string, content: string){
    const fd = fs.openSync(filePath, 'w+');
    fs.writeFileSync(fd, content, {flag: 'w+'})
}

/**
 * 读取文件
 * @param filePath
 */
export function readFile(filePath: string) {
    return fs.readFileSync(filePath, {encoding: 'utf-8'})
}

/**
 * 获取父目录的路径
 * @param filePath
 */
export function getParent(filePath: string) {
    return filePath.substring(0, filePath.lastIndexOf('\\'));
}