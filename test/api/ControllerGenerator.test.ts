import {ControllerGenerator} from "../../src/api/generator/ControllerGenerator";
import {TbMemberController} from "../data/API";

test("test controller generate", () => {
    ControllerGenerator.generate(TbMemberController)
})