import { BrandFilter } from '../../components/brand-filter';
import { CategoryFilter } from '../../components/category-filter';
import { DoubleSlider } from '../../components/double-slider/double-slider';
import { Sorter } from '../../components/sorter/sorter';
import Page from '../../components/templates/page';
import { Model, Loader } from '../../model/model';
import { Router } from '../router';

class MainPage extends Page {
    static TextObject = {
        MainTitle: 'Main Page',
    };

    private model: Model;
    private categoryFilter: CategoryFilter;
    private brandFilter: BrandFilter;
    private priceSlider: DoubleSlider;
    private stockSlider: DoubleSlider;
    private productsGrid: HTMLDivElement;
    private router: Router;
    private sorter: Sorter;
    private amountProducts: HTMLDivElement = document.createElement('div');

    constructor(id: string, model: Model, router: Router) {
        super(id);
        this.model = model;
        this.router = router;
        this.categoryFilter = new CategoryFilter(model);
        this.brandFilter = new BrandFilter(model);
        this.model.addEventListener('change', this.rerender.bind(this));
        this.priceSlider = new DoubleSlider(model.priceModel);
        this.stockSlider = new DoubleSlider(model.stockModel);
        this.sorter = new Sorter(model);
    }

    render() {
        console.log('start render main-page');
        const title = this.createTitle(MainPage.TextObject.MainTitle);
        this.container.append(title);

        const container = document.createElement('div');
        container.className = 'container';
        this.container.append(container);

        const containerRow = document.createElement('div');
        containerRow.className = 'row';
        container.append(containerRow);

        const filters = document.createElement('div');
        filters.className = 'col-4';
        filters.append(this.categoryFilter.render());
        filters.append(this.brandFilter.render());
        filters.append(this.priceSlider.render());
        filters.append(this.stockSlider.render());
        containerRow.append(filters);

        const products = document.createElement('div');
        products.className = 'col-8';
        containerRow.append(products);

        const search = document.createElement('nav');
        search.className = 'navbar navbar-light bg-light';
        products.append(search);

        const form = document.createElement('form');
        form.className = 'form-inline';
        search.append(form);

        const input = document.createElement('input');
        input.className = 'form-control';
        // input.ariaLabel = 'Default';
        input.id = 'elastic';
        input.placeholder = 'Search product';
        form.append(input);

        const counter = document.createElement('div');
        counter.id = 'counter';
        search.append(counter);

        const bigGrid = document.createElement('div');
        bigGrid.className = 'big active';
        bigGrid.id = 'big';
        search.append(bigGrid);
        const smallGrid = document.createElement('div');
        smallGrid.className = 'small';
        smallGrid.id = 'small';
        search.append(smallGrid);
        form.append(this.sorter.render());

        // const totalPrice = document.createElement('div');
        // totalPrice.id = 'total-price';
        // if (localStorage.getItem('amount') === null) {
        //     totalPrice.innerText = `${'Total price: ' + '0' + ' $'}`;
        // } else {
        //     totalPrice.innerText = `${'Total price: ' + localStorage.getItem('amount') + '$'}`;
        // }
        // const header = document.querySelector('header>*') as HTMLDivElement;
        // const firstChild = document.querySelectorAll('a')[1] as HTMLElement;
        // header.insertBefore(totalPrice, firstChild);

        // const count = document.createElement('div');
        // if (localStorage.getItem('count') === null) {
        //     count.innerText = '0';
        // } else {
        //     count.innerText = `${localStorage.getItem('count')}`;
        // }
        // count.id = 'count';
        // firstChild.appendChild(count);

        // this.amountProducts.textContent = '';
        // this.amountProducts.textContent = this.model.numberProducts.toString();
        // search.append(this.amountProducts);

        this.productsGrid = document.createElement('div');
        this.productsGrid.className = 'row grid';
        products.append(this.productsGrid);
        console.log('productsGrid created');
        this.renderProducts();

        const loader = new Loader();

        loader.load().then((data) => {
            console.log('start loader');
            this.model.data = data;
            this.model.router = this.router;
        });

        return this.container;
    }

    renderProducts() {
        if (this.productsGrid) {
            console.log('productsGrid true');
            this.productsGrid.innerHTML = '';
        }
        console.log('create products');
        for (const product of this.model.filteredProducts) {
            const productCol = document.createElement('div');
            productCol.className = 'col-4';
            this.productsGrid.appendChild(productCol);

            this.amountProducts.textContent = '';
            this.amountProducts.textContent = this.model.numberProducts.toString();

            const productId = product.id;

            const card = document.createElement('a');
            card.className = 'card mb-3';
            card.href = `#${'/item-page/' + productId}`;
            // card.target = '_blank';
            productCol.appendChild(card);

            const img = document.createElement('img');
            img.className = 'card-img-top';
            img.src = product.thumbnail;
            img.style.objectFit = 'contain';
            img.style.height = '200px';
            card.appendChild(img);

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            card.appendChild(cardBody);

            const h5 = document.createElement('h5');
            h5.className = 'card-title';
            h5.textContent = product.title;
            cardBody.appendChild(h5);

            const p = document.createElement('p');
            p.className = 'card-text';
            p.textContent = product.description;
            cardBody.appendChild(p);

            const price = document.createElement('p');
            price.className = 'price-text';
            price.textContent = 'Price: ' + product.price.toString() + ' $';
            cardBody.appendChild(price);

            const object = document.createElement('object');
            card.appendChild(object);

            const add = document.createElement('a');
            const productIdString = productId.toString();
            if (localStorage.getItem(productIdString)) {
                card.classList.add('select');
                price.classList.add('total');
                add.className = 'btn btn-danger button-card';
                add.textContent = 'Drop from basket';
            } else {
                add.className = 'btn btn-success button-card';
                add.textContent = 'Add to basket';
            }
            add.addEventListener('click', (event) => {
                event.preventDefault();
                if (localStorage.getItem(productIdString)) {
                    localStorage.removeItem(productIdString);
                    card.classList.remove('select');
                    price.classList.remove('total');
                    add.innerText = 'Add to basket';
                    add.className = 'btn btn-success button-card';
                } else {
                    localStorage.setItem(productIdString, JSON.stringify(product));
                    card.classList.add('select');
                    price.classList.add('total');
                    add.innerText = 'Drop from basket';
                    add.className = 'btn btn-danger button-card';
                }
                const sum = Array.from(document.querySelectorAll('.total'));
                let amount = 0;
                for (let i = 0, count = sum.length; i < count; i++) {
                    amount += Number(sum[i].textContent?.replace(/[^0-9]/g, ''));
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
                if (val != '') {
                    elasticItems.forEach(function (elem) {
                        if (elem.innerText.toLowerCase().search(val.toLowerCase()) == -1) {
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

            if (localStorage.getItem('style') === 'col-2') {
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
        console.log('start rerender');
        this.renderProducts();
        this.brandFilter.rerender();
        this.categoryFilter.rerender();
        this.priceSlider.rerender();
        this.stockSlider.rerender();
        this.sorter.rerender();
    }
}

export default MainPage;
