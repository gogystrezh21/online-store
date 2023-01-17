import { Model } from '../model/model';
import { Filter } from './filter';

export class BrandFilter extends Filter {
    private _model: Model;
    public constructor(model: Model) {
        super();
        this._model = model;
    }
    protected get parameters(): string[] {
        return this._model.data?.brands ?? [];
    }
    protected set selectedParameters(arr: string[]) {
        this._model.selectedBrands = arr;
    }
    protected isChecked(parameter: string): boolean {
        return this._model.selectedBrands.includes(parameter);
    }
}
