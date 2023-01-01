import { Model } from '../model/model';
import { Filter } from './filter';

export class CategoryFilter extends Filter {
    private model: Model;
    public constructor(model: Model) {
        super();
        this.model = model;
    }
    protected get parameters(): string[] {
        return this.model.data?.categories ?? [];
    }
    protected set selectedParameters(arr: string[]) {
        this.model.selectedCategories = arr;
    }
    protected isChecked(parameter: string): boolean {
        return this.model.selectedCategories.includes(parameter);
    }
}
