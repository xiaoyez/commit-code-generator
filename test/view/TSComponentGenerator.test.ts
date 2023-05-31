import {FilterGenerator} from "../../src/frontend/view/generator/page/FilterGenerator";
import {memberFilterViewDef, memberTableViewDef} from "../common";
import {TableViewGenerator} from "../../src/frontend/view/generator/page/TableViewGenerator";


describe("ComponentGenerator", () => {
    it('generate filter comp', () => {
        console.log(FilterGenerator.generate(memberFilterViewDef));
    });

    it('generate table comp', () => {
        console.log(TableViewGenerator.generate(memberTableViewDef));
    })
});