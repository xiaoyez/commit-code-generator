import {FilterGenerator} from "../src/frontend/view/generator/page/FilterGenerator";
import {memberFilterViewDef} from "./common";


describe("FilterGenerator", () => {
    it('generate', () => {
        console.log(FilterGenerator.generate(memberFilterViewDef));
    });
});