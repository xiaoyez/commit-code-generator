import {DataEnum} from "../definition/DataEnum";
import {config} from "../../config/Config";
import {getJavaFilePath} from "../../utils/JavaUtils";
import {exist, getParent, mkdirs, writeStringToFile} from "../../utils/FileUtils";


export class JavaConstantClassGenerator {
    static generateJavaConstantClass(dataEnum: DataEnum) {
        const text = JavaConstantClassGenerator.generateContent(dataEnum);
        const filePath = config.baseDir + `\\${getJavaFilePath(dataEnum.package,dataEnum.name)}`;
        const fileDir = getParent(filePath);
        if (!exist(fileDir))
            mkdirs(fileDir);
        writeStringToFile(filePath,text);
    }

    private static generateContent(dataEnum: DataEnum) {
        const packageName = dataEnum.package;
        const className = dataEnum.name;

        let text = '';
        text += `package ${packageName};` + '\n\n';

        text += `/** ${dataEnum.comment} */` + '\n';
        text += `public class ${className} {` + '\n';

        dataEnum.options.forEach(option => {
            text += `\t/** ${option.description} */` + '\n';
            text += `\tpublic static int ${option.sign} = ${option.value};` + '\n\n';
        })

        text += '}';
        return text;
    }
}