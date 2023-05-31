import {JavaConstantClassGenerator} from "../../src/db/generator/JavaConstantClassGenerator";
import {memberStatusEnumDef} from "../common";


test('test 根据dataEnum生成java常量类', ()=>{
    JavaConstantClassGenerator.generateJavaConstantClass(memberStatusEnumDef)
})