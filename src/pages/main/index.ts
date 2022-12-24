import { BrandFilter } from '../../components/brand-filter';
import { CategoryFilter } from '../../components/category-filter';
import { DoubleSlider } from '../../components/double-slider/double-slider';
import Page from '../../components/templates/page';
import { Model } from '../../model/model';

class MainPage extends Page {
    static TextObject = {
        MainTitle: 'Main Page',
    };

    private model: Model;
    private categoryFilter: CategoryFilter;
    private brandFilter: BrandFilter;
    private doubleSlider: DoubleSlider;

    constructor(id: string, model: Model) {
        super(id);
        this.model = model;
        this.categoryFilter = new CategoryFilter(model);
        this.brandFilter = new BrandFilter(model);
        this.model.addEventListener('change', this.rerender.bind(this));
        this.doubleSlider = new DoubleSlider(model);
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
        filters.append(this.doubleSlider.render());
        containerRow.append(filters);

        const products = document.createElement('div');
        products.className = 'col-8';
        containerRow.append(products);

        const productsGrid = document.createElement('div');
        productsGrid.className = 'row';
        products.append(productsGrid);

        for (const product of this.model.filteredProducts) {
            const productCol = document.createElement('div');
            productCol.className = 'col-4';
            productsGrid.appendChild(productCol);

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
        }

        return this.container;
    }

    rerender() {
        this.container.innerHTML = '';
        this.render();
    }
}

export default MainPage;
