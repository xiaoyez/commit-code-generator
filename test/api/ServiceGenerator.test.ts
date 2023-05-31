import {ServiceGenerator} from "../../src/api/generator/ServiceGenerator";
import {TbMemberController} from "../data/API";

test("test service generate", () => {
    ServiceGenerator.generate(TbMemberController)
})
