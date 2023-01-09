import { ModalForm } from '../../components/modal-form';
import Page from '../../components/templates/page';
import { Model } from '../../model/model';
import { IProduct } from '../../types';
import { Router } from '../router';
import './index.css';

class BasketPage extends Page {
    private title = 'Basket Page';
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

        const title = this.createTitle(this.title);
        this.container.append(title);

        const container = document.createElement('div');
        container.classList.add('container');
        this.container.append(container);

        const containerRow = document.createElement('div');
        containerRow.classList.add('row');
        container.append(containerRow);

        const products = document.createElement('div');
        products.classList.add('col-8');
        containerRow.append(products);

        const summary = document.createElement('div');
        summary.classList.add('col-4');
        containerRow.append(summary);

        const nav = document.createElement('div');
        nav.classList.add('card', 'card-nav');
        products.appendChild(nav);

        const navSummary = document.createElement('div');
        navSummary.classList.add('card', 'card-nav');
        summary.appendChild(navSummary);

        const textSummary = document.createElement('h2');
        textSummary.classList.add('text-product');
        navSummary.appendChild(textSummary);
        textSummary.textContent = 'Summary';

        const summaryInfo = document.createElement('div');
        summaryInfo.classList.add('card', 'card-summary');
        summary.appendChild(summaryInfo);

        const productsText = document.createElement('h2');
        productsText.classList.add('products-amount');
        productsText.innerText = `${'Products: ' + localStorage.getItem('count')}`;
        summaryInfo.appendChild(productsText);

        const totalText = document.createElement('h2');
        totalText.classList.add('products-amount');
        totalText.textContent = `${'Total: ' + localStorage.getItem('amount') + ' $'}`;
        summaryInfo.appendChild(totalText);

        const totalTextTen = document.createElement('h2');
        totalTextTen.classList.add('products-amount');
        const tenDiscount = (Number(localStorage.getItem('amount')) * 0.9).toFixed(2).toString();
        totalTextTen.textContent = `${'Total: ' + tenDiscount + ' $'}`;
        summaryInfo.appendChild(totalTextTen);
        totalTextTen.style.display = 'none';

        const input = document.createElement('input');
        input.classList.add('form-control', 'promo');
        input.placeholder = 'Enter promo code';
        summaryInfo.appendChild(input);

        const addedPromos = document.createElement('div');
        addedPromos.classList.add('card', 'added-promos');
        summaryInfo.appendChild(addedPromos);
        const addedPromosText = document.createElement('h4');
        addedPromosText.classList.add('card', 'added-text');
        addedPromosText.textContent = 'Added Promos:';
        addedPromos.appendChild(addedPromosText);
        addedPromos.style.display = 'none';

        const rolling = document.createElement('h4');
        rolling.classList.add('rolling');
        rolling.textContent = 'Rolling-Scopes -10%';
        summaryInfo.appendChild(rolling);
        const rollingInside = document.createElement('h4');
        rollingInside.classList.add('rolling');
        rollingInside.textContent = 'Rolling-Scopes -10%';
        addedPromos.appendChild(rollingInside);
        rollingInside.style.display = 'none';
        const addRolling = document.createElement('button');
        addRolling.classList.add('btn', 'btn-primary', 'btn-sm', 'add-rolling');
        addRolling.textContent = 'Add';
        rolling.appendChild(addRolling);
        const addRollingInside = document.createElement('button');
        addRollingInside.classList.add('btn', 'btn-primary', 'btn-sm', 'add-rolling-inside');
        addRollingInside.textContent = 'Drop';
        rollingInside.appendChild(addRollingInside);
        rolling.style.display = 'none';
        addRolling.style.display = 'none';

        const textProduct = document.createElement('h2');
        textProduct.classList.add('text-product');
        nav.appendChild(textProduct);
        textProduct.textContent = 'Products in basket';
        input.oninput = function () {
            if (input?.value.trim().toLowerCase() === 'rs') {
                rolling.style.display = 'block';
                addRolling.style.display = 'inline';
                addRollingInside.addEventListener('click', (event) => {
                    event.preventDefault();
                    addedPromos.style.display = 'none';
                    addRolling.style.display = 'inline';
                    addRolling.textContent = 'Add';
                    totalText.style.textDecoration = 'none';
                    totalTextTen.style.display = 'none';
                });
                if (addedPromos.style.display === 'block') {
                    addRolling.style.display = 'none';
                }
                addRolling.addEventListener('click', (event) => {
                    event.preventDefault();
                    if (addRolling.textContent === 'Add') {
                        totalText.style.textDecoration = 'line-through';
                        addedPromos.style.display = 'block';
                        rollingInside.style.display = 'block';
                        addRolling.style.display = 'none';
                        totalTextTen.style.display = 'block';
                    }
                });
            } else {
                rolling.style.display = 'none';
                addRolling.style.display = 'none';
            }
        };

        const promo = document.createElement('h5');
        promo.classList.add('promo');
        promo.textContent = `${'Promo for test: ' + '`JS`, ' + '`RS`'}`;
        summaryInfo.appendChild(promo);
        const buy = document.createElement('button');
        buy.classList.add('btn', 'btn-primary', 'buy');
        buy.textContent = 'Buy now';
        buy.id = 'modal-button';
        buy.addEventListener('click', () => {
            this.modalForm.show();
            this.router.setQueryParam('showModal', '1');
        });
        summaryInfo.appendChild(buy);
        summary.className = 'col-4';
        containerRow.append(summary);

        for (const product of basketProducts) {
            const info = document.createElement('div');
            info.classList.add('card', 'basket');
            products.appendChild(info);

            const img = document.createElement('img');
            img.classList.add('card-img-top', 'basket');
            img.src = product.thumbnail;
            img.style.objectFit = 'cover';
            img.style.height = '200px';
            img.style.width = '200px';
            info.appendChild(img);

            const textInfo = document.createElement('div');
            textInfo.classList.add('text-info');
            info.appendChild(textInfo);

            const stock = document.createElement('div');
            stock.classList.add('stock');
            info.appendChild(stock);

            const stockText = document.createElement('h6');
            stockText.classList.add('stock-text');
            stockText.textContent = `${'Stock: ' + product.stock}`;
            stock.appendChild(stockText);

            const stockCount = document.createElement('div');
            stockCount.classList.add('stock-count');
            stock.appendChild(stockCount);

            let stockCountNum = 1;
            const minus = document.createElement('div');
            minus.classList.add('stock-minus');
            minus.textContent = '-';
            stockCount.appendChild(minus);

            const stockSelect = document.createElement('div');
            stockSelect.classList.add('stock-select');
            stockSelect.innerText = `${stockCountNum}`;
            stockCount.appendChild(stockSelect);

            const plus = document.createElement('div');
            plus.classList.add('stock-plus');
            plus.textContent = '+';
            stockCount.appendChild(plus);

            const stockPrice = document.createElement('h6');
            stockPrice.classList.add('stock-text');
            stockPrice.textContent = `${product.price * Number(stockSelect.textContent) + ' $'}`;
            stock.appendChild(stockPrice);

            plus.addEventListener('click', (event) => {
                event.preventDefault();
                stockCountNum++;
                stockSelect.innerText = `${stockCountNum}`;
                stockPrice.textContent = `${product.price * Number(stockSelect.textContent) + ' $'}`;
                const lsPlus = Number(localStorage.getItem('count')) + 1;
                localStorage.setItem('count', lsPlus.toString());
                const count = document.getElementById('count') as HTMLDivElement;
                count.innerText = `${localStorage.getItem('count')}`;
                productsText.innerText = `${'Products: ' + localStorage.getItem('count')}`;
                const lsPlusAmount = Number(localStorage.getItem('amount')) + product.price;
                localStorage.setItem('amount', lsPlusAmount.toString());
                const amount = document.getElementById('total-price') as HTMLDivElement;
                amount.innerText = `${'Total cost: ' + localStorage.getItem('amount') + ' $'}`;
                totalText.innerText = `${'Total: ' + localStorage.getItem('amount') + ' $'}`;
                if (Number(stockSelect.innerText) === product.stock) {
                    plus.style.pointerEvents = 'none';
                }
            });

            minus.addEventListener('click', (event) => {
                event.preventDefault();
                stockCountNum--;
                stockSelect.innerText = `${stockCountNum}`;
                stockPrice.textContent = `${product.price * Number(stockSelect.textContent) + ' $'}`;
                const lsMinus = Number(localStorage.getItem('count')) - 1;
                localStorage.setItem('count', lsMinus.toString());
                const count = document.getElementById('count') as HTMLDivElement;
                count.innerText = `${localStorage.getItem('count')}`;
                productsText.innerText = `${'Products: ' + localStorage.getItem('count')}`;
                const lsPlusAmount = Number(localStorage.getItem('amount')) - product.price;
                localStorage.setItem('amount', lsPlusAmount.toString());
                const amount = document.getElementById('total-price') as HTMLDivElement;
                amount.innerText = `${'Total cost: ' + localStorage.getItem('amount') + ' $'}`;
                totalText.innerText = `${'Total: ' + localStorage.getItem('amount') + ' $'}`;
                const productKey = product.id.toString();
                if (Number(stockSelect.innerText) === 0) {
                    localStorage.removeItem(productKey);
                    console.log(info);
                    info.remove();
                    console.log(product.id);
                    // num.textContent = forCount.toString();
                }
            });

            const h5 = document.createElement('h5');
            h5.classList.add('card-title');
            h5.textContent = product.title;
            textInfo.appendChild(h5);

            const p = document.createElement('p');
            p.classList.add('card-text');
            p.textContent = product.description;
            textInfo.appendChild(p);

            const rating = document.createElement('p');
            rating.classList.add('card-rating');
            rating.textContent = `${'Rating: ' + product.rating.toString() + ' ☆'}`;
            textInfo.appendChild(rating);

            const discount = document.createElement('p');
            discount.classList.add('card-discount');
            discount.textContent = `${'Discount: ' + product.discountPercentage.toString() + ' %'}`;
            textInfo.appendChild(discount);
        }
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
