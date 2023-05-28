import {DataEnum} from "../definition/DataEnum";
import {config} from "../../config/Config";
import {getJavaFilePath} from "../../utils/JavaUtils";
import {exist, getParent, mkdirs, writeStringToFile} from "../../utils/FileUtils";
import {compileEjsTmp} from "../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../ejsTmp/EjsTmp";


export class JavaConstantClassGenerator {
    /**
     * 生成Java常量类。
     * @param dataEnum
     */
    static generateJavaConstantClass(dataEnum: DataEnum) {
        const text = JavaConstantClassGenerator.generateContent(dataEnum);
        const filePath = config.baseDir + `\\${getJavaFilePath(dataEnum.package,dataEnum.name)}`;
        const fileDir = getParent(filePath);
        if (!exist(fileDir))
            mkdirs(fileDir);
        writeStringToFile(filePath,text);
    }

    /**
     * 生成Java常量类的内容。
     * @param dataEnum
     * @private
     */
    private static generateContent(dataEnum: DataEnum) {
        return compileEjsTmp(ejsTmp.javaConstantClassTmp, dataEnum);
    }
}