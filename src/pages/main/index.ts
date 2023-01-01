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
        input.className = 'form-control mr-sm-2';
        input.id = 'elastic';
        input.placeholder = 'Search product';
        form.append(input);

        const bigGrid = document.createElement('div');
        bigGrid.className = 'big active';
        bigGrid.id = 'big';
        search.append(bigGrid);
        const smallGrid = document.createElement('div');
        smallGrid.className = 'small';
        smallGrid.id = 'small';
        search.append(smallGrid);
        search.append(this.sorter.render());

        this.amountProducts.textContent = '';
        this.amountProducts.textContent = this.model.numberProducts.toString();
        search.append(this.amountProducts);

        this.productsGrid = document.createElement('div');
        this.productsGrid.className = 'row grid';
        products.append(this.productsGrid);
        console.log('productsGrid created');
        this.renderProducts();

        const loader = new Loader();

        loader.load().then((data) => {
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
        this.amountProducts.textContent = '';
        this.amountProducts.textContent = this.model.numberProducts.toString();
        console.log('create products');
        for (const product of this.model.filteredProducts) {
            const productCol = document.createElement('div');
            productCol.className = 'col-4';
            this.productsGrid.appendChild(productCol);

            const productId = product.id;

            const card = document.createElement('a');
            card.className = 'card mb-3';
            card.href = `#${'/item-page/' + productId}`;
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

            const object = document.createElement('object');
            card.appendChild(object);

            const add = document.createElement('a');
            add.href = `#${111}`;
            add.className = 'btn btn-outline-dark button-card';
            add.textContent = 'Add to basket';
            object.appendChild(add);

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
                productCol.className = 'col-4';
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
                productCol.className = 'col-2';
                smallGrid.classList.add('active');
                bigGrid.classList.remove('active');
                localStorage.setItem('style', productCol.className);
                img.style.height = '100px';
                p.style.display = 'none';
                h5.style.fontSize = '14px';
                new Router().setQueryParam('', 'smallGrid');
                searcher();
            });

            if (localStorage.getItem('style') === 'col-2') {
                smallGrid.classList.add('active');
                bigGrid.classList.remove('active');
                productCol.className = 'col-2';
                img.style.height = '100px';
                p.style.display = 'none';
                h5.style.fontSize = '14px';
                searcher();
            } else {
                productCol.className = 'col-4';
                img.style.height = '200px';
                p.style.display = 'block';
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
