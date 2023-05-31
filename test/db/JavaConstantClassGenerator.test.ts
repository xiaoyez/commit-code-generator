import {JavaConstantClassGenerator} from "../../src/db/generator/JavaConstantClassGenerator";
import {MemberStatusEnumDef} from "../data/enums";



test('test 根据dataEnum生成java常量类', ()=>{
    JavaConstantClassGenerator.generateJavaConstantClass(MemberStatusEnumDef)
})