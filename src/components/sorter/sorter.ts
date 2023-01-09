import { Model } from '../../model/model';

export class Sorter {
    options: HTMLOptionElement[];
    model: Model;
    select: HTMLSelectElement;

    constructor(model: Model) {
        this.model = model;
        this.options = [];
    }

    isSelected(parameter: string): boolean {
        return this.model.selectedSort === parameter;
    }

    render() {
        this.select = document.createElement('select') as HTMLSelectElement;
        this.select.addEventListener('change', this.onSelected.bind(this));
        this.renderParameters();
        return this.select;
    }

    rerender(): void {
        this.renderParameters();
    }

    renderParameters(): HTMLSelectElement {
        const sortParameters = [
            'Sort options:',
            'Sort by price ASC',
            'Sort by price DESC',
            'Sort by rating ASC',
            'Sort by rating DESC',
        ];

        if (this.options.length !== 0) {
            for (const option of this.options) {
                option.remove();
            }
        }

        this.options = [];
        this.select.classList.add('form-select');
        for (const sortParameter of sortParameters) {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value = sortParameter;
            option.selected = this.isSelected(sortParameter);
            option.textContent = sortParameter;
            this.select.append(option);
            this.options.push(option);
        }
        return this.select;
    }

    onSelected(): void {
        let selectOption = '';
        for (const option of this.options) {
            if (option.selected) {
                selectOption = option.value;
            }
        }
        this.model.selectedSort = selectOption;
    }
}
