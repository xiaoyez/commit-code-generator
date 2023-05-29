import {FilterDefinition} from "../frontend/view/definition/page/FilterDefinition";
import {
    InputControl,
    TextInputControl,
    SelectInputControl,
    DateInputControl, DictSelectInputControl
} from "../frontend/view/definition/page/FormDefinition";
import {ejsTmp} from "../ejsTmp/EjsTmp";

interface FilterControlVM {
    modelPath: string;
    tmpName: keyof typeof ejsTmp;
}

interface FilterTextVM extends FilterControlVM {
    placeholder: TextInputControl['placeholder'];
    tmpName: 'filterTextControlTmp';
}

function filterTextInputViewModel(modelName: string, itemDef: TextInputControl): FilterTextVM {
    const {placeholder, vModelName} = itemDef;
    const modelPath = `${modelName}.${vModelName}`;
    return {placeholder, modelPath, tmpName: 'filterTextControlTmp'};
}

interface FilterSelectVM extends FilterControlVM {
    placeholder: SelectInputControl['placeholder'];
    listName: SelectInputControl['listName'];
    iterName: SelectInputControl['iterName'];
    keyFiled: string;
    label: SelectInputControl['label'];
    value: SelectInputControl['value'];
    tmpName: 'filterSelectControlTmp';
}

function filterSelectInputViewModel(modelName: string, itemDef: SelectInputControl): FilterSelectVM {
    const {
        placeholder, vModelName,
        listName, iterName,
        key, label, value,
    } = itemDef;

    const modelPath = `${modelName}.${vModelName}`;
    const keyFiled = key || value;

    return {
        placeholder, modelPath, listName,
        iterName, keyFiled, label, value,
        tmpName: 'filterSelectControlTmp',
    };
}

interface FilterTimeVMBase extends FilterControlVM {
    format: DateInputControl['format'];
    tmpName: 'filterDateControlTmp';
    compType: string;
}

interface FilterTimeVM extends FilterTimeVMBase {
    isRange: false;
    placeholder: DateInputControl['startPlaceholder'];
}

interface FilterTimeRangeVM extends FilterTimeVMBase {
    isRange: true;
    rangeSeparator: DateInputControl['rangeSeparator'];
    startPlaceholder: DateInputControl['startPlaceholder'];
    endPlaceholder: DateInputControl['endPlaceholder'];
}

type FilterDatePickerVM = FilterTimeVM | FilterTimeRangeVM;

function filterDatePickerViewModel(modelName: string, itemDef: DateInputControl): FilterDatePickerVM {
    const {
        isRange,
        model,
        format,
        withTime,
        rangeSeparator,
        startPlaceholder,
        endPlaceholder,
    } = itemDef;

    let compType = 'data';
    if (withTime) {
        compType += 'time';
    }

    const common: {
        format: typeof format;
        tmpName: FilterTimeVMBase['tmpName'];
    } = {
        format,
        tmpName: 'filterDateControlTmp',
    };

    if (isRange) {
        return {
            isRange: true,
            modelPath: model,
            compType: `${compType}range`,
            rangeSeparator,
            startPlaceholder,
            endPlaceholder,
            ...common,
        };
    } else {
        return {
            isRange: false,
            modelPath: `${modelName}.${model}`,
            compType,
            placeholder: startPlaceholder,
            ...common,
        };
    }
}

type FilterInputVM = FilterTextVM | FilterSelectVM | FilterDatePickerVM;

type InputVMFn = (modelName: string, itemDef: InputControl) => FilterInputVM;

const filterControlVMMap = new Map<InputControl, InputVMFn>([
    [TextInputControl.prototype, filterTextInputViewModel as InputVMFn],
    [SelectInputControl.prototype, filterSelectInputViewModel as InputVMFn],
    [DictSelectInputControl.prototype, filterSelectInputViewModel as InputVMFn],
    [DateInputControl.prototype, filterDatePickerViewModel as InputVMFn],
])


function filterInputViewModel(modelName: string, itemDef: InputControl) {
    let proto = Object.getPrototypeOf(itemDef);
    let vmFn = filterControlVMMap.get(proto)
        || filterTextInputViewModel as InputVMFn;
    return vmFn(modelName, itemDef);
}

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

    return {
        filterFormDef,
        items,
        api,
        modelName,
        refName,
        vShowName,
        dateRanges,
    }
}