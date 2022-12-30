import { Router } from '../pages/router';
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
    private _router: Router | null;
    private _selectedSort: string;
    private _numberProducts = 25;

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
        console.log('set data');
        this._data = value;
        this.priceModel.range = this._data?.price ?? { min: 0, max: 1 };
        this.stockModel.range = this._data?.stock ?? { min: 0, max: 1 };
        if (this._data != null) {
            this._numberProducts = this._data.products.length;
        }
        this.change();
    }

    set router(router: Router) {
        this._selectedBrands = router.getQueryParams('brands[]');
        this._selectedCategories = router.getQueryParams('categories[]');
        const selectParam = router.getQueryParam('sort');
        if (selectParam != null) {
            this._selectedSort = selectParam;
        }
        this.priceModel.router = router;
        this.stockModel.router = router;
        this._router = router;
        this.change();
    }

    get numberProducts(): number {
        console.log(this._filteredProducts.length);
        return this._numberProducts;
    }

    get selectedCategories(): string[] {
        return this._selectedCategories;
    }

    set selectedCategories(arr: string[]) {
        if (!this.isStringArraysEquals(this._selectedCategories, arr)) {
            this._selectedCategories = arr;
            this.change();
        }
    }

    get selectedBrands(): string[] {
        return this._selectedBrands;
    }

    set selectedBrands(arr: string[]) {
        if (!this.isStringArraysEquals(this._selectedBrands, arr)) {
            this._selectedBrands = arr;
            this.change();
        }
    }

    get selectedSort(): string {
        return this._selectedSort;
    }

    set selectedSort(value: string) {
        console.log('selected sort');
        if (this._selectedSort != value) {
            this._selectedSort = value;
        }
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
        this._numberProducts = this._filteredProducts.length;
        console.log(this._numberProducts);
    }

    sort() {
        console.log('start sort');
        switch (this._selectedSort) {
            case 'Sort options':
                break;
            case 'Sort by price ASC':
                this._filteredProducts = this._filteredProducts.sort((a: IProduct, b: IProduct) => a.price - b.price);
                break;
            case 'Sort by price DESC':
                this._filteredProducts = this._filteredProducts.sort((a: IProduct, b: IProduct) => b.price - a.price);
                break;
            case 'Sort by rating ASC':
                this._filteredProducts = this._filteredProducts.sort((a: IProduct, b: IProduct) => a.rating - b.rating);
                break;
            case 'Sort by rating DESC':
                this._filteredProducts = this._filteredProducts.sort((a: IProduct, b: IProduct) => b.rating - a.rating);
                break;
        }
    }

    get filteredProducts(): IProduct[] {
        return this._filteredProducts;
    }

    change() {
        console.log('change model');
        this.filter();
        this.sort();

        if (this._router != null) {
            this._router.setQueryParam('lowPrice', this.priceModel.low.toString());
            this._router.setQueryParam('highPrice', this.priceModel.high.toString());
            this._router.setQueryParam('lowStock', this.stockModel.low.toString());
            this._router.setQueryParam('highStock', this.stockModel.high.toString());
            this._router.setQueryParam('categories[]', this.selectedCategories);
            this._router.setQueryParam('brands[]', this.selectedBrands);
            this._router.setQueryParam('sort', this.selectedSort);
        }

        this.dispatchEvent(new CustomEvent('change'));
    }

    isStringArraysEquals(a1: string[], a2: string[]): boolean {
        a1 = a1.slice(0);
        a2 = a2.slice(0);
        let value: string | undefined;
        while ((value = a2.pop()) !== undefined) {
            const index = a1.indexOf(value);
            if (index == -1) {
                return false;
            }

            a1.splice(index, 1);
        }

        return a1.length == 0;
    }
}

export abstract class RangeModelView extends EventTarget {
    private _range: IRange = { min: 0, max: 1 };
    private _low = 0;
    private _high = 1;

    public abstract set router(router: Router);

    public set range(range: IRange) {
        if (this._range.min != range.min || this._range.max != range.max) {
            this._range = range;
            this.low = this._range.min;
            this.high = this._range.max;
            this.dispatchEvent(new CustomEvent('change'));
        }
    }

    public get range(): IRange {
        return this._range;
    }

    public set low(min: number) {
        if (this._low != min) {
            this._low = min;
            this.dispatchEvent(new CustomEvent('change'));
        }
    }

    public get low(): number {
        return this._low;
    }

    set high(max: number) {
        if (this._high != max) {
            this._high = max;
            this.dispatchEvent(new CustomEvent('change'));
        }
    }

    get high(): number {
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

    set router(router: Router) {
        const paramLow = router.getQueryParam('lowPrice');
        const paramHigh = router.getQueryParam('highPrice');
        if (paramLow !== null) {
            this.low = Number(paramLow);
        }
        if (paramHigh !== null) {
            this.high = Number(paramHigh);
        }
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

    set router(router: Router) {
        const paramLow = router.getQueryParam('lowStock');
        const paramHigh = router.getQueryParam('highStock');
        if (paramLow !== null) {
            this.low = Number(paramLow);
        }
        if (paramHigh !== null) {
            this.high = Number(paramHigh);
        }
    }
}
