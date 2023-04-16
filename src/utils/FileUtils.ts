import * as fs from "fs";

export function exist(path: string) {
    return fs.existsSync(path);
}

export function mkdirs(dirPath: string) {
    fs.mkdirSync(dirPath, {recursive: true})
}

export function writeStringToFile(filePath: string, content: string){
    const fd = fs.openSync(filePath, 'w+');
    fs.writeFileSync(fd, content, {flag: 'w+'})
}

export function getParent(filePath: string) {
    return filePath.substring(0, filePath.lastIndexOf('\\'));
}