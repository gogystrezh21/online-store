export abstract class Filter {
    checkboxes: HTMLInputElement[];
    ul: HTMLUListElement;
    constructor() {
        this.onChecked = this.onChecked.bind(this);
        this.checkboxes = [];
    }
    protected abstract get parameters(): string[];
    protected abstract set selectedParameters(arr: string[]);
    protected abstract isChecked(parameter: string): boolean;

    render(): HTMLUListElement {
        this.checkboxes = [];
        this.ul = document.createElement('ul') as HTMLUListElement;
        this.renderParameters();
        return this.ul;
    }

    onChecked(): void {
        const arr = [];
        for (const checkbox of this.checkboxes) {
            if (checkbox.checked) {
                arr.push(checkbox.value);
            }
        }
        this.selectedParameters = arr;
    }

    rerender(): void {
        this.renderParameters();
    }

    renderParameters(): void {
        console.log('start render parameters');
        for (const checkbox of this.checkboxes) {
            checkbox.parentElement?.remove();
            checkbox.removeEventListener('change', this.onChecked);
        }
        this.checkboxes = [];
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
            this.ul.append(li);
        }
    }
}
