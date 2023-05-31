import {FilterGenerator} from "../../src/frontend/view/generator/page/FilterGenerator";
import {TableViewGenerator} from "../../src/frontend/view/generator/page/TableViewGenerator";
import {memberFilterDef, memberTableViewDef} from "../data/view";


describe("ComponentGenerator", () => {
    it('generate filter comp', () => {
        console.log(FilterGenerator.generate(memberFilterDef));
    });

    it('generate table comp', () => {
        console.log(TableViewGenerator.generate(memberTableViewDef));
    })
});