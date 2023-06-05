import {FilterDefinition} from "../definition/page/FilterDefinition";
import {compileEjsTmp} from "../../../ejsTmp/EjsUtils";
import {ejsTmp} from "../../../ejsTmp/EjsTmp";
import {TableViewDefinition} from "../definition/page/TableViewDefinition";
import {FormDialogDefinition} from "../definition/page/FormDialogDefinition";
import {
    commonPageViewModel,
    filterCompViewModel,
    formDialogViewModel,
    tableViewCompViewModel
} from "../../../utils/VueComponentUtils";
import {IndexDefinition} from "../definition/page/IndexDefinition";
import {config} from "../../../config/Config";
import {mkdirs, writeStringToFile} from "../../../utils/FileUtils";

export class PageGenerator {
    static generateFilter(filterDefinition: FilterDefinition) {
        return compileEjsTmp(ejsTmp.filterTmp, filterCompViewModel(filterDefinition))
    }

    static generateTableView(tableViewDefinition: TableViewDefinition) {
        return compileEjsTmp(ejsTmp.tableViewTmp, tableViewCompViewModel(tableViewDefinition));
    }

    static generateFormDialog(formDialogDefinition: FormDialogDefinition) {
        return compileEjsTmp(ejsTmp.formDialogTmp, formDialogViewModel(formDialogDefinition));
    }

    static generateIndexPageContent(indexDefinition: IndexDefinition) {
        return compileEjsTmp(ejsTmp.pageIndexTmp, commonPageViewModel(indexDefinition));
    }

    static generateViewPageFile(indexDefinition: IndexDefinition) {
        // 创建该模块对应的文件夹
        const folderPath = `${config.baseDir}\\${config.frontRoot}\\views\\${indexDefinition.name}`;
        mkdirs(folderPath);

        // 创建index.vue
        const indexPath = `${folderPath}\\index.vue`;
        writeStringToFile(indexPath, PageGenerator.generateIndexPageContent(indexDefinition));

        // 创建filter.vue
        const filterPath = `${folderPath}\\${indexDefinition.filter.fileName}.vue`;
        writeStringToFile(filterPath, PageGenerator.generateFilter(indexDefinition.filter));

        // 创建tableView.vue
        const tableViewPath = `${folderPath}\\${indexDefinition.tableView.fileName}.vue`;
        writeStringToFile(tableViewPath, PageGenerator.generateTableView(indexDefinition.tableView));

        // 创建formDialog.vue
        const formDialogPath = `${folderPath}\\${indexDefinition.formDialog.fileName}.vue`;
        writeStringToFile(formDialogPath, PageGenerator.generateFormDialog(indexDefinition.formDialog));
    }
}