import {FilterDefinition} from "../frontend/view/definition/page/FilterDefinition";
import {getImportLinesRecord, getTypeImportsFrom} from "./TSImportUtils";
import {tsTypeString} from "./TypeUtils";
import {filterInputViewModel, FilterInputVM, FilterTimeRangeVM} from "./VueControlUtils";

export function filterCompViewModel(filterDefinition: FilterDefinition) {
    const {
        filterFormDefinition: filterFormDef,
        api,
    } = filterDefinition;

    const modelName = filterFormDef.modelName || 'queryParams'
    const refName = filterFormDef.refName || 'queryForm'
    const vShowName = filterFormDef.vShowName || 'showSearch';

    let items = filterFormDef.items
        .map(({label, prop, inputControl}) => ({
            label, prop, info: filterInputViewModel(modelName, inputControl)
        }));

    function isRange(info: FilterInputVM): info is FilterTimeRangeVM {
        return info.tmpName === 'filterDateControlTmp' && info.isRange;
    }

    let dateRanges = items
        .map(({info}) => info)
        .filter(isRange);

    let importLines = getImportLinesRecord(getTypeImportsFrom(api.params!));
    let queryTypeName = tsTypeString(api.params!);

    return {
        items,
        api,
        modelName,
        refName,
        vShowName,
        dateRanges,
        importLines,
        queryTypeName,
    }
}