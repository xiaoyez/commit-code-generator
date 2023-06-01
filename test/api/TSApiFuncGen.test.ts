import {generateTsApiFileModule, generateTsApiFunc} from "../../src/api/generator/TSApiCallGenerator";
import {ModuleUtils} from "../../src/api/utils/ModuleUtils";
import {TbMemberController} from "../data/API";

describe('api call script', () => {


    it('generate api call func', function () {
        let prefix = ModuleUtils.buildBaseUrlPrefix(TbMemberController);
        console.log(generateTsApiFunc(TbMemberController.apis[0], prefix));
    });

    it('generate api module to file', function () {
        generateTsApiFileModule(TbMemberController);
    });
});