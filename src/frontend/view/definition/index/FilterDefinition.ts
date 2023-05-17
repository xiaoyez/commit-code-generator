export interface FilterDefinition {
    fileName: string;

    filterFormDefinition: FilterFormDefinition

}

export interface FilterFormDefinition {
    modelName?: string;
    refName?: string;
    vShowName?: string;
    items: FilterFormItemDefinition[]
}

export interface FilterFormItemDefinition {
    label: string;
    prop: string;
    inputControl: InputControl;
}

export class InputControl {

}

export class TextInputControl extends InputControl {
    vModelName: string;
    placeholder: string;

    constructor(vModelName: string, placeholder: string) {
        super();
        this.vModelName = vModelName;
        this.placeholder = placeholder;
    }
}

export class SelectInputControl extends InputControl {
    vModelName: string;
    placeholder: string;
    listName: string;
    iterName: string;
    key:string;
    label: string;
    value: string;


    constructor(vModelName: string, placeholder: string, listName: string, iterName: string, key: string, label: string, value: string) {
        super();
        this.vModelName = vModelName;
        this.placeholder = placeholder;
        this.listName = listName;
        this.iterName = iterName;
        this.key = key;
        this.label = label;
        this.value = value;
    }
}

export class DictSelectInputControl extends SelectInputControl {
    constructor(vModelName: string, placeholder: string, dictName: string, iterName: string,) {
        super(vModelName,placeholder,`getDict(${dictName})`,iterName,'value','label','value');
    }
}

export class DateInputControl extends InputControl {
    isRange: boolean;
    // 是否带时分秒
    withTime: boolean;
    startPlaceholder?: string;
    endPlaceholder?: string;
    // 同时也是value-format
    format?: string;
    rangeSeparator?: string;
    model?: string;


    constructor(isRange: boolean, withTime: boolean, startPlaceholder?: string, endPlaceholder?: string, format?: string, rangeSeparator?: string, model?: string) {
        super();
        this.isRange = isRange;
        this.withTime = withTime;
        this.startPlaceholder = startPlaceholder;
        this.endPlaceholder = endPlaceholder;
        this.format = format;
        this.rangeSeparator = rangeSeparator;
        this.model = model;
    }
}