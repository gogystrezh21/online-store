export abstract class Filter {
    checkboxes: HTMLInputElement[];
    constructor() {
        this.onChecked = this.onChecked.bind(this);
        this.checkboxes = [];
    }
    protected abstract get parameters(): string[];
    protected abstract set selectedParameters(arr: string[]);
    protected abstract isChecked(parameter: string): boolean;

    render(): HTMLUListElement {
        this.checkboxes = [];
        const ul = document.createElement('ul') as HTMLUListElement;
        for (const parameter of this.parameters) {
            const li = document.createElement('li') as HTMLLIElement;
            const checkbox = document.createElement('input') as HTMLInputElement;
            checkbox.type = 'checkbox';
            checkbox.value = parameter;
            checkbox.checked = this.isChecked(parameter);
            checkbox.addEventListener('change', this.onChecked);
            this.checkboxes.push(checkbox);
            const label = document.createElement('label') as HTMLLabelElement;
            const text = document.createTextNode(parameter);
            label.append(checkbox, text);
            li.append(label);
            ul.append(li);
        }
        return ul;
    }

    onChecked() {
        const arr = [];
        for (const checkbox of this.checkboxes) {
            if (checkbox.checked) {
                arr.push(checkbox.value);
            }
        }
        console.log(arr);
        this.selectedParameters = arr;
    }
}
