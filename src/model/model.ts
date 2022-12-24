import { IData, IProduct, IRange } from '../types';

export class Loader {
    load(): Promise<IData> {
        return fetch('./data.json')
            .then((res) => res.json())
            .then((data) => data);
    }
}
export class Model extends EventTarget {
    private _data: IData | null = null;
    private _selectedCategories: string[] = [];
    private _selectedBrands: string[] = [];
    private _filteredProducts: IProduct[] = [];
    public readonly price: PriceModelView;

    constructor() {
        super();
        this.price = new PriceModelView();
    }

    get data(): IData | null {
        return this._data;
    }

    set data(value: IData | null) {
        this._data = value;
        this.filter();
        this.price.priceRange = this._data?.price ?? { min: 0, max: 1 };
        this.dispatchEvent(new CustomEvent('change'));
    }

    get selectedCategories(): string[] {
        return this._selectedCategories;
    }

    set selectedCategories(arr: string[]) {
        this._selectedCategories = arr;
        this.filter();
        this.dispatchEvent(new CustomEvent('change'));
    }

    get selectedBrands(): string[] {
        return this._selectedBrands;
    }

    set selectedBrands(arr: string[]) {
        this._selectedBrands = arr;
        this.filter();
        this.dispatchEvent(new CustomEvent('change'));
    }

    filter() {
        let filtered: IProduct[] = [];
        let current: IProduct[] = this._data?.products ?? [];
        if (this._selectedBrands.length > 0) {
            for (const product of current) {
                for (const brand of this._selectedBrands) {
                    if (product.brand === brand) {
                        filtered.push(product);
                    }
                }
            }
            current = filtered;
            filtered = [];
        }
        if (this._selectedCategories.length > 0) {
            for (const product of current) {
                for (const category of this._selectedCategories) {
                    if (product.category === category) {
                        filtered.push(product);
                    }
                }
            }
            current = filtered;
            filtered = [];
        }
        this._filteredProducts = current;
    }

    get filteredProducts(): IProduct[] {
        return this._filteredProducts;
    }
}

class PriceModelView {
    private _priceRange: IRange;

    set priceRange(price: IRange) {
        this._priceRange = price;
    }
}
