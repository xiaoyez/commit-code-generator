import {DataEnum} from "../src/db/definition/DataEnum";
import {DataEnumOption} from "../src/db/definition/DataEnumOption";
import {JavaConstantClassGenerator} from "../src/db/generator/JavaConstantClassGenerator";

const dataEnum = new DataEnum({
    name: "AuditStatusConstant",
    package: "com.cgmanage.web.modules.ypx.constants",
    options: [
        new DataEnumOption({
            description: "审核中",
            sign: "AUDITING",
            value: 1
        }),
        new DataEnumOption({
            description: "通过",
            sign: "PASS",
            value: 2
        }),new DataEnumOption({
            description: "拒绝",
            sign: "REJECT",
            value: 3
        }),
    ],

})

test('test 根据dataEnum生成java常量类', ()=>{
    JavaConstantClassGenerator.generateJavaConstantClass(dataEnum)
})