import {memberFilterDef, memberFormDialogDef, memberTableViewDef} from "../data/view";
import {PageGenerator} from "../../src/frontend/view/generator/PageGenerator";


describe("ComponentGenerator", () => {
    it('generate filter comp', () => {
        console.log(PageGenerator.generateFilter(memberFilterDef));
    });

    it('generate table comp', () => {
        console.log(PageGenerator.generateTableView(memberTableViewDef));
    });

    it('generate from dialog comp', () => {
        console.log(PageGenerator.generateFormDialog(memberFormDialogDef));
    });
});