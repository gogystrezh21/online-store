import { Model } from '../model/model';
import { Filter } from './filter';

export class BrandFilter extends Filter {
    private model: Model;
    public constructor(model: Model) {
        super();
        this.model = model;
    }
    protected get parameters(): string[] {
        return this.model.data?.brands ?? [];
    }
    protected set selectedParameters(arr: string[]) {
        this.model.selectedBrands = arr;
    }
    protected isChecked(parameter: string): boolean {
        return this.model.selectedBrands.includes(parameter);
    }
}
