import { BrandFilter } from '../../components/brand-filter';
import { CategoryFilter } from '../../components/category-filter';
import { RangeSlider } from '../../components/range-slider/range-slider';
import { Sorter } from '../../components/sorter/sorter';
import Page from '../../components/templates/page';
import { NOT_NUMBER_STARTED_REGEXP } from '../../constants/regexp';
import { Model, Loader } from '../../model/model';
import { ItemText, MainText } from '../../types';
import { Router } from '../router';

class MainPage extends Page {
    static TextObject = {
        MainTitle: 'Main Page',
    };

    private _model: Model;
    private _categoryFilter: CategoryFilter;
    private _brandFilter: BrandFilter;
    private _priceSlider: RangeSlider;
    private _stockSlider: RangeSlider;
    private _productsGrid: HTMLDivElement;
    private _router: Router;
    private _sorter: Sorter;
    private _amountProducts: HTMLDivElement = document.createElement('div');

    constructor(id: string, model: Model, router: Router) {
        super(id);
        this._model = model;
        this._router = router;
        this._categoryFilter = new CategoryFilter(model);
        this._brandFilter = new BrandFilter(model);
        this._model.addEventListener('change', this.rerender.bind(this));
        this._priceSlider = new RangeSlider(model.priceModel);
        this._stockSlider = new RangeSlider(model.stockModel);
        this._sorter = new Sorter(model);
    }

    render() {
        const container = document.createElement('div');
        container.classList.add('container');
        this.container.append(container);

        const containerRow = document.createElement('div');
        containerRow.classList.add('row');
        container.append(containerRow);

        const filters = document.createElement('div');
        filters.classList.add('col-4', 'filters');

        const categoryFilter = document.createElement('div');
        const categoryFilterTitle = document.createElement('span');
        categoryFilterTitle.textContent = MainText.categoriesText;
        categoryFilter.append(categoryFilterTitle, this._categoryFilter.render());

        const brandFilter = document.createElement('div');
        const brandFilterTitle = document.createElement('span');
        brandFilterTitle.textContent = MainText.brandText;
        categoryFilter.append(brandFilterTitle, this._brandFilter.render());

        const priceSlider = document.createElement('div');
        const priceSliderTitle = document.createElement('span');
        priceSliderTitle.textContent = MainText.priceText;
        priceSlider.append(priceSliderTitle, this._priceSlider.render());

        const stockSlider = document.createElement('div');
        const stockSliderTitle = document.createElement('span');
        stockSliderTitle.textContent = MainText.stockPrice;
        stockSlider.append(stockSliderTitle, this._stockSlider.render());

        filters.append(categoryFilter, brandFilter, priceSlider, stockSlider);
        containerRow.append(filters);

        const products = document.createElement('div');
        products.classList.add('col-8');
        containerRow.append(products);

        const search = document.createElement('nav');
        search.classList.add('navbar', 'navbar-light', 'bg-light');
        products.append(search);

        const form = document.createElement('form');
        form.classList.add('form-inline');
        search.append(form);

        const input = document.createElement('input');
        input.classList.add('form-control');
        input.id = 'elastic';
        input.placeholder = 'Search product';
        form.append(input);

        const counter = document.createElement('div');
        counter.id = 'counter';
        search.append(counter);

        const bigGrid = document.createElement('div');
        bigGrid.classList.add('big', 'active');
        bigGrid.id = 'big';
        search.append(bigGrid);
        const smallGrid = document.createElement('div');
        smallGrid.classList.add('small');
        smallGrid.id = 'small';
        search.append(smallGrid);
        form.append(this._sorter.render());

        this._productsGrid = document.createElement('div');
        this._productsGrid.classList.add('row', 'grid');
        products.append(this._productsGrid);
        this.renderProducts();

        const loader = new Loader();

        loader.load().then((data) => {
            this._model.data = data;
            this._model.router = this._router;
        });

        return this.container;
    }

    renderProducts() {
        if (this._productsGrid) {
            this._productsGrid.innerHTML = '';
        }
        for (const product of this._model.filteredProducts) {
            const productCol = document.createElement('div');
            productCol.className = `${localStorage.getItem('style')}`;
            this._productsGrid.appendChild(productCol);

            this._amountProducts.textContent = '';
            this._amountProducts.textContent = this._model.numberProducts.toString();

            const productId = product.id;

            const card = document.createElement('a');
            card.classList.add('card', 'mb-3');
            card.href = `#${'/item-page/' + productId}`;
            productCol.appendChild(card);

            const img = document.createElement('img');
            img.classList.add('card-img-top');
            img.src = product.thumbnail;
            img.style.objectFit = 'contain';
            img.style.height = '200px';
            card.appendChild(img);

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            card.appendChild(cardBody);

            const h5 = document.createElement('h5');
            h5.classList.add('card-title');
            h5.textContent = product.title;
            cardBody.appendChild(h5);

            const p = document.createElement('p');
            p.classList.add('card-text');
            p.textContent = product.description;
            cardBody.appendChild(p);

            const price = document.createElement('p');
            price.classList.add('price-text');
            price.textContent = 'Price: ' + product.price.toString() + ' $';
            cardBody.appendChild(price);

            const object = document.createElement('object');
            card.appendChild(object);

            const add = document.createElement('a');
            const productIdString = productId.toString();
            if (localStorage.getItem(productIdString)) {
                card.classList.add('select');
                price.classList.add('total');
                add.classList.add('btn', 'btn-danger', 'button-card');
                add.textContent = ItemText.dropFromCardText;
            } else {
                add.classList.add('btn', 'btn-success', 'button-card');
                add.textContent = ItemText.addToCardText;
            }
            add.addEventListener('click', (event) => {
                event.preventDefault();
                if (localStorage.getItem(productIdString)) {
                    localStorage.removeItem(productIdString);
                    card.classList.remove('select');
                    price.classList.remove('total');
                    add.innerText = ItemText.addToCardText;
                    add.classList.add('btn', 'btn-success', 'button-card');
                } else {
                    localStorage.setItem(productIdString, JSON.stringify(product));
                    card.classList.add('select');
                    price.classList.add('total');
                    add.innerText = ItemText.dropFromCardText;
                    add.className = 'btn btn-danger button-card';
                }
                const sum = Array.from(document.querySelectorAll('.total'));
                let amount = 0;
                for (let i = 0, count = sum.length; i < count; i++) {
                    amount += Number(sum[i].textContent?.replace(NOT_NUMBER_STARTED_REGEXP, ''));
                }
                localStorage.setItem('count', sum.length.toString());
                localStorage.setItem('amount', amount.toString());
                const totalPrice = document.getElementById('total-price') as HTMLDivElement;
                totalPrice.innerText = `${'Total cost: ' + localStorage.getItem('amount') + ' $'}`;
                const count = document.getElementById('count') as HTMLDivElement;
                count.innerText = `${localStorage.getItem('count')}`;
            });

            object.appendChild(add);
            const counter = document.getElementById('counter') as HTMLDivElement;

            const input = document.getElementById('elastic') as HTMLInputElement;
            let val = input?.value.trim().toLowerCase();
            const smallGrid = document.getElementById('small') as HTMLDivElement;
            const bigGrid = document.getElementById('big') as HTMLDivElement;
            const elasticItems = document.querySelectorAll<HTMLElement>('.row.grid>*');
            const searcher = () => {
                if (val !== '') {
                    elasticItems.forEach(function (elem) {
                        if (elem.innerText.toLowerCase().search(val.toLowerCase()) === -1) {
                            elem.classList.add('hide');
                        } else {
                            elem.classList.remove('hide');
                        }
                    });
                } else {
                    elasticItems.forEach(function (elem) {
                        elem.classList.remove('hide');
                    });
                }
                const openArray = Array.from(document.querySelectorAll<HTMLElement>('.open')).length;
                counter.innerText = `${
                    'Found: ' +
                    Math.min(
                        openArray,
                        openArray - Array.from(document.querySelectorAll<HTMLElement>('.hide')).length
                    ).toString()
                }`;
            };

            input.oninput = function () {
                val = input.value;
                localStorage.setItem('formData', val);
                searcher();
                new Router().setQueryParam('search', val);
            };
            if (localStorage.getItem('formData')) {
                input.value = localStorage.getItem('formData') as string;
                searcher();
            }

            new Router().setQueryParam('', 'bigGrid');

            bigGrid.addEventListener('click', () => {
                productCol.className = 'col-4 open';
                smallGrid.classList.remove('active');
                bigGrid.classList.add('active');
                localStorage.setItem('style', productCol.className);
                img.style.height = '200px';
                p.style.display = 'block';
                h5.style.fontSize = '1.25rem';
                new Router().setQueryParam('', 'bigGrid');
                searcher();
            });

            smallGrid.addEventListener('click', () => {
                productCol.className = 'col-2 open';
                smallGrid.classList.add('active');
                bigGrid.classList.remove('active');
                localStorage.setItem('style', productCol.className);
                img.style.height = '100px';
                p.style.fontSize = '0.1px';
                h5.style.fontSize = '14px';
                new Router().setQueryParam('', 'smallGrid');
                searcher();
            });

            if (localStorage.getItem('style') === 'col-2 open') {
                smallGrid.classList.add('active');
                bigGrid.classList.remove('active');
                productCol.className = 'col-2 open';
                img.style.height = '100px';
                p.style.fontSize = '0.1px';
                h5.style.fontSize = '14px';
                searcher();
            } else {
                productCol.className = 'col-4 open';
                img.style.height = '200px';
                p.style.display = 'block';
                p.style.fontSize = '1rem';
                h5.style.fontSize = '1.25rem';
                searcher();
            }
        }
    }

    rerender() {
        this.renderProducts();
        this._brandFilter.renderParameters();
        this._categoryFilter.renderParameters();
        this._priceSlider.rerender();
        this._stockSlider.rerender();
        this._sorter.rerender();
    }
}

export default MainPage;
