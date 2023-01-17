import Page from '../../components/templates/page';
import { Loader, Model } from '../../model/model';
import { BasketText, IProduct, ItemText } from '../../types';
import './index.css';

class ItemPage extends Page {
    static TextObject = {
        MainTitle: 'Item Page',
    };
    productId: string;
    model: Model;
    currentProduct: IProduct;
    productContainer: HTMLDivElement;
    currentImg: HTMLDivElement;

    constructor(id: string, productId: string) {
        super(id);
        this.productId = productId;
        this.model = new Model();
        this.currentProduct;
        this.productContainer;
    }

    private onMinImgClicked(event: Event): void {
        this.currentImg.innerHTML = '';
        const img = document.createElement('img');
        const target = event.target as HTMLLIElement;
        const newImg = target.querySelector('img');
        if (newImg !== null) {
            img.src = newImg.src;
        }
        img.alt = 'Slide';
        img.className = 'current-img';
        this.currentImg.append(img);
    }

    private onAddToCardClick(event: Event, button: HTMLButtonElement): void {
        event.preventDefault();
        const product = localStorage.getItem(this.productId);
        const amountValue = localStorage.getItem('amount');
        const countValue = localStorage.getItem('count');
        if (product) {
            localStorage.removeItem(this.productId);
            button.textContent = ItemText.addToCardText;
            button.className = 'btn btn-primary';
            if (amountValue) {
                const newTotal = Math.abs(Number(amountValue) - this.currentProduct.price);
                localStorage.setItem('amount', newTotal.toString());
                const newCount = Math.abs(Number(countValue) - 1);
                localStorage.setItem('count', newCount.toString());
            }
        } else {
            localStorage.setItem(this.productId, JSON.stringify(this.currentProduct));
            button.textContent = ItemText.dropFromCardText;
            button.className = 'btn btn-danger';
            if (amountValue) {
                const newTotal = Math.abs(Number(amountValue) + this.currentProduct.price);
                localStorage.setItem('amount', newTotal.toString());
                const newCount = Math.abs(Number(countValue) + 1);
                localStorage.setItem('count', newCount.toString());
            } else {
                localStorage.setItem('amount', this.currentProduct.price.toString());
                localStorage.setItem('count', '1');
            }
        }
        const totalPrice = document.getElementById('total-price') as HTMLDivElement;
        totalPrice.innerText = `${'Total cost: ' + localStorage.getItem('amount') + ' $'}`;
        const count = document.getElementById('count') as HTMLDivElement;
        count.innerText = `${localStorage.getItem('count')}`;
    }

    getCurrentProduct(): void {
        const products = this.model.data?.products;
        if (products !== undefined) {
            for (const product of products) {
                if (product.id === Number(this.productId)) {
                    this.currentProduct = product;
                    localStorage.getItem(this.productId);
                }
            }
        }
    }

    renderBreadcrumbs(): HTMLElement {
        const breadcrumb = document.createElement('nav');
        breadcrumb.ariaLabel = 'breadcrumb';
        breadcrumb.className = 'col-12';
        breadcrumb.classList.add('breadcrumb_product');

        const breadcrumbArray = [
            { text: 'Store', link: '#/main-page' },
            { text: this.currentProduct.category, link: '' },
            { text: this.currentProduct.brand, link: '' },
            { text: this.currentProduct.title, link: '' },
        ];

        const ol = document.createElement('ol');
        ol.className = 'breadcrumb';

        for (const obj of breadcrumbArray) {
            const li = document.createElement('li');
            li.className = 'breadcrumb-item';

            const a = document.createElement('a');
            a.textContent = obj.text.toUpperCase();
            if (obj.link !== '') {
                a.href = obj.link;
            }
            li.append(a);
            ol.append(li);
        }
        breadcrumb.append(ol);
        return breadcrumb;
    }

    renderMiniPhotos(): HTMLUListElement {
        const miniPhotos = document.createElement('ul');
        miniPhotos.className = 'col-4';
        for (const url of this.currentProduct.images) {
            const li = document.createElement('li');
            const img = document.createElement('img');
            li.className = 'photo-list';
            img.className = 'min-img';
            img.style.pointerEvents = 'none';
            img.src = url;
            img.alt = 'Slide';
            li.addEventListener('click', this.onMinImgClicked.bind(this));
            li.append(img);
            miniPhotos.append(li);
        }
        return miniPhotos;
    }

    renderPhotos(): HTMLDivElement {
        const photos = document.createElement('div');
        photos.className = 'col-6';

        const photosContainer = document.createElement('div');
        photosContainer.className = 'row';
        photos.append(photosContainer);

        this.currentImg = document.createElement('div');
        this.currentImg.className = 'col-8';

        const img = document.createElement('img');
        img.src = this.currentProduct.thumbnail;
        img.alt = 'Slide';
        img.className = 'current-img';

        this.currentImg.append(img);

        const miniPhotos = this.renderMiniPhotos();
        photosContainer.append(miniPhotos, this.currentImg);

        return photos;
    }

    renderProductInfo(): HTMLDivElement {
        const aboutProduct = document.createElement('div');
        aboutProduct.className = 'col-3';

        const description = document.createElement('div');
        description.className = 'description-block';
        description.textContent = 'Description: ' + this.currentProduct.description;

        const discountPercentage = document.createElement('div');
        discountPercentage.className = 'description-block';
        discountPercentage.textContent = 'Discount Percentage: ' + this.currentProduct.discountPercentage.toString();

        const rating = document.createElement('div');
        rating.className = 'description-block';
        rating.textContent = 'Rating: ' + this.currentProduct.rating.toString() + '☆';

        const stock = document.createElement('div');
        stock.className = 'description-block';
        stock.textContent = 'Stock: ' + this.currentProduct.stock.toString();

        const brand = document.createElement('div');
        brand.className = 'description-block';
        brand.textContent = 'Brand: ' + this.currentProduct.brand;

        const category = document.createElement('div');
        category.className = 'description-block';
        category.textContent = 'Category: ' + this.currentProduct.category;

        aboutProduct.append(description, discountPercentage, rating, stock, brand, category);

        return aboutProduct;
    }

    renderCard(): HTMLDivElement {
        const card = document.createElement('div');
        card.className = 'col-3 price-block';

        const price = document.createElement('div');
        price.className = 'price';
        price.textContent = 'Price: ' + this.currentProduct.price.toString() + ' $';

        const addToCardButton = document.createElement('button');
        addToCardButton.className = 'btn btn-primary';
        addToCardButton.textContent = ItemText.addToCardText;

        if (localStorage.getItem(this.productId)) {
            price.classList.add('total');
            addToCardButton.className = 'btn btn-danger';
            addToCardButton.textContent = ItemText.dropFromCardText;
        } else {
            addToCardButton.className = 'btn btn-primary';
            addToCardButton.textContent = ItemText.addToCardText;
        }

        addToCardButton.addEventListener('click', (event) => {
            this.onAddToCardClick(event, addToCardButton);
        });

        const buyNow = document.createElement('button');
        buyNow.className = 'btn btn-success';
        buyNow.textContent = BasketText.buyNow;
        buyNow.addEventListener('click', () => {
            const amountValue = localStorage.getItem('amount');
            const countValue = localStorage.getItem('count');
            if (localStorage.getItem(this.productId) === null) {
                localStorage.setItem(this.productId, JSON.stringify(this.currentProduct));
                if (amountValue) {
                    const newTotal = Math.abs(Number(amountValue) + this.currentProduct.price);
                    localStorage.setItem('amount', newTotal.toString());
                    const newCount = Math.abs(Number(countValue) + 1);
                    localStorage.setItem('count', newCount.toString());
                }
            }
            window.location.href = '/#/basket-page?showModal=1';
            window.location.reload();
        });

        card.append(price, addToCardButton, buyNow);

        return card;
    }

    renderProduct(): void {
        this.productContainer = document.createElement('div');
        this.productContainer.className = 'container';

        const productRow = document.createElement('div');
        productRow.className = 'row';

        const breadcrumb = this.renderBreadcrumbs();
        const photos = this.renderPhotos();
        const aboutProduct = this.renderProductInfo();
        const card = this.renderCard();

        productRow.append(breadcrumb, photos, aboutProduct, card);
        this.productContainer.append(productRow);
    }

    load(): void {
        const loader = new Loader();
        loader.load().then((data) => {
            this.model.data = data;
            this.getCurrentProduct();
            this.renderProduct();
            this.container.append(this.productContainer);
        });
    }

    render(): HTMLElement {
        this.load();
        return this.container;
    }
}

export default ItemPage;
