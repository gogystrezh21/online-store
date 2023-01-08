import { ModalForm } from '../../components/modal-form';
import Page from '../../components/templates/page';
import { Model } from '../../model/model';
import { IProduct } from '../../types';
import { Router } from '../router';
import './index.css';

class BasketPage extends Page {
    static TextObject = {
        BasketTitle: 'Basket Page',
    };
    productId: string;
    model: Model;
    currentProduct: IProduct;
    productContainer: HTMLDivElement;

    constructor(id: string, private router: Router, private modalForm: ModalForm) {
        super(id);
        this.model = new Model();
        this.currentProduct;
        this.productContainer;
    }

    // getBasketProducts() {
    //     console.log('start current product');
    //     // const products = this.model.data?.products;
    // }
    renderProducts(): void {
        const basketProducts = [];
        for (const key in localStorage) {
            if (key.length < 3) {
                this.currentProduct = JSON.parse(localStorage.getItem(key)!);
                basketProducts.push(this.currentProduct);
            }
        }
        const title = this.createTitle(BasketPage.TextObject.BasketTitle);
        this.container.append(title);

        const container = document.createElement('div');
        container.className = 'container';
        this.container.append(container);

        const containerRow = document.createElement('div');
        containerRow.className = 'row';
        container.append(containerRow);

        const products = document.createElement('div');
        products.className = 'col-8';
        containerRow.append(products);

        const summary = document.createElement('div');
        summary.className = 'col-2';
        containerRow.append(summary);

        const modalButton = document.createElement('button');
        modalButton.className = 'col-2';
        modalButton.classList.add('btn');
        modalButton.classList.add('btn-primary');
        modalButton.id = 'modal-button';
        modalButton.addEventListener('click', () => {
            this.modalForm.show();
            this.router.setQueryParam('showModal', '1');
        });
        containerRow.append(modalButton);

        if (Number(localStorage.getItem('count')) === 0) {
            modalButton.style.display = 'none';
        } else {
            modalButton.style.display = 'inline-block';
        }

        for (const product of basketProducts) {
            const info = document.createElement('div');
            info.className = 'info';
            products.appendChild(info);

            const img = document.createElement('img');
            img.className = 'card-img-top';
            img.src = product.thumbnail;
            img.style.objectFit = 'contain';
            img.style.height = '200px';
            info.appendChild(img);

            const textInfo = document.createElement('div');
            textInfo.className = 'text-info';
            info.appendChild(textInfo);

            const h5 = document.createElement('h5');
            h5.className = 'card-title';
            h5.textContent = product.title;
            textInfo.appendChild(h5);

            const p = document.createElement('p');
            p.className = 'card-text';
            p.textContent = product.description;
            textInfo.appendChild(p);
            // const productCol = document.createElement('div');
            // // productCol.className = 'col-4';
            // products.appendChild(productCol);
        }
        // const productCol = document.createElement('div');
        // productCol.className = 'col-4';
    }
    load(): void {
        // const loader = new Loader();
        // loader.load().then((data) => {
        //     console.log('start loader');
        //     this.model.data = data;
        // this.getBasketProducts();
        this.renderProducts();
        // this.container.append(this.productContainer);
    }

    render() {
        if (this.router.getQueryParam('showModal') === '1') {
            this.modalForm.show();
        }

        this.load();
        return this.container;
    }
}

export default BasketPage;
