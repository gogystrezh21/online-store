import { BrandFilter } from '../../components/brand-filter';
import { CategoryFilter } from '../../components/category-filter';
import { DoubleSlider } from '../../components/double-slider/double-slider';
import Page from '../../components/templates/page';
import { Model } from '../../model/model';
// import { PagesIds } from '../../types';
import { Router } from '../../pages/router';

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

    constructor(id: string, model: Model) {
        super(id);
        this.model = model;
        this.categoryFilter = new CategoryFilter(model);
        this.brandFilter = new BrandFilter(model);
        this.model.addEventListener('change', this.rerender.bind(this));
        this.priceSlider = new DoubleSlider(model.priceModel);
        this.stockSlider = new DoubleSlider(model.stockModel);
    }

    render() {
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

        this.productsGrid = document.createElement('div');
        this.productsGrid.className = 'row grid';
        products.append(this.productsGrid);
        console.log('productsGrid created');
        this.renderProducts();

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

            const card = document.createElement('div');
            card.className = 'card mb-3';
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
                bigGrid.removeEventListener;
                smallGrid.classList.remove('active');
                bigGrid.classList.add('active');
                productCol.className = 'col-4';
                localStorage.setItem('style', productCol.className);
                img.style.height = '200px';
                p.style.display = 'block';
                h5.style.fontSize = '1.25rem';
                new Router().setQueryParam('', 'bigGrid');
                searcher();
            });

            smallGrid.addEventListener('click', () => {
                smallGrid.classList.add('active');
                bigGrid.classList.remove('active');
                productCol.className = 'col-2';
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
        this.renderProducts();
        this.brandFilter.rerender();
        this.categoryFilter.rerender();
        this.priceSlider.rerender();
        this.stockSlider.rerender();
    }
}

export default MainPage;
