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
    public readonly priceModel: PriceModelView;
    public readonly stockModel: StockModelView;

    constructor() {
        super();
        this.priceModel = new PriceModelView();
        this.stockModel = new StockModelView();
        this.priceModel.addEventListener('change', this.change.bind(this));
        this.stockModel.addEventListener('change', this.change.bind(this));
    }

    get data(): IData | null {
        return this._data;
    }

    set data(value: IData | null) {
        this._data = value;
        this.priceModel.range = this._data?.price ?? { min: 0, max: 1 };
        this.stockModel.range = this._data?.stock ?? { min: 0, max: 1 };
        this.change();
    }

    get selectedCategories(): string[] {
        return this._selectedCategories;
    }

    set selectedCategories(arr: string[]) {
        this._selectedCategories = arr;
        this.change();
    }

    get selectedBrands(): string[] {
        return this._selectedBrands;
    }

    set selectedBrands(arr: string[]) {
        this._selectedBrands = arr;
        this.change();
    }

    filter() {
        console.log('start filter');
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
        current = this.priceModel.filterByRange(current);
        this._filteredProducts = this.stockModel.filterByRange(current);
        console.log(this._filteredProducts);
    }

    get filteredProducts(): IProduct[] {
        return this._filteredProducts;
    }

    change() {
        this.filter();
        this.dispatchEvent(new CustomEvent('change'));
    }
}

export abstract class RangeModelView extends EventTarget {
    private _range: IRange = { min: 0, max: 1 };
    private _low = 0;
    private _high = 1;

    set range(range: IRange) {
        this._range = range;
        this._low = this._range.min;
        this._high = this._range.max;
        this.dispatchEvent(new CustomEvent('change'));
    }

    get range() {
        return this._range;
    }

    set low(min: number) {
        this._low = min;
        this.dispatchEvent(new CustomEvent('change'));
    }

    get low() {
        return this._low;
    }

    set high(max: number) {
        this._high = max;
        this.dispatchEvent(new CustomEvent('change'));
    }

    get high() {
        return this._high;
    }

    abstract filterByRange(products: IProduct[]): IProduct[];
}

export class PriceModelView extends RangeModelView {
    filterByRange(products: IProduct[]): IProduct[] {
        const filteredPriceProducts = [];
        for (const product of products) {
            if (product.price >= this.low && product.price <= this.high) {
                filteredPriceProducts.push(product);
            }
        }
        return filteredPriceProducts;
    }
}

export class StockModelView extends RangeModelView {
    filterByRange(products: IProduct[]): IProduct[] {
        const filteredStockProducts = [];
        for (const product of products) {
            if (product.stock >= this.low && product.stock <= this.high) {
                filteredStockProducts.push(product);
            }
        }
        return filteredStockProducts;
    }
}
