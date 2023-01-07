import Page from '../../components/templates/page';
import { Loader, Model } from '../../model/model';
import { IProduct } from '../../types';
import './index.css';

class ItemPage extends Page {
    static TextObject = {
        MainTitle: 'Item Page',
    };
    productId: string;
    model: Model;
    currentProduct: IProduct;
    productContainer: HTMLDivElement;

    constructor(id: string, productId: string) {
        super(id);
        this.productId = productId;
        this.model = new Model();
        this.currentProduct;
        this.productContainer;
    }

    getCurrentProduct() {
        console.log('start current product');
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

    renderProduct(): void {
        this.productContainer = document.createElement('div');
        this.productContainer.className = 'row';

        const breadcrumb = document.createElement('nav');
        breadcrumb.ariaLabel = 'breadcrumb';
        breadcrumb.className = 'col-12';

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

        const photos = document.createElement('div');
        photos.className = 'col-6';

        const photosContainer = document.createElement('div');
        photosContainer.className = 'row';

        photos.append(photosContainer);

        const currentImg = document.createElement('div');
        currentImg.className = 'col-8';
        const img = document.createElement('img');
        img.src = this.currentProduct.thumbnail;
        img.alt = 'Slide';
        currentImg.append(img);

        const miniPhotos = document.createElement('ul');
        miniPhotos.className = 'col-4';
        for (const url of this.currentProduct.images) {
            const li = document.createElement('li');
            const img = document.createElement('img');
            li.className = 'photo-list';
            li.style.height = '80px';
            li.style.width = '80px';
            img.style.maxHeight = '80px';
            img.style.maxWidth = '80px';
            img.style.pointerEvents = 'none';
            img.src = url;
            img.alt = 'Slide';
            li.addEventListener('click', (event) => {
                currentImg.innerHTML = '';
                const img = document.createElement('img');
                const target = event.target as HTMLLIElement;
                const newImg = target.querySelector('img');
                if (newImg !== null) {
                    img.src = newImg.src;
                }
                img.alt = 'Slide';
                img.style.maxHeight = '500px';
                img.style.maxWidth = '500px';
                currentImg.append(img);
            });
            li.append(img);
            miniPhotos.append(li);
        }

        photosContainer.append(miniPhotos, currentImg);

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

        const buttons = document.createElement('div');
        buttons.className = 'col-3';

        const price = document.createElement('div');
        price.className = 'price';
        price.textContent = 'Price: ' + this.currentProduct.price.toString() + ' $';

        const addToCard = document.createElement('button');
        addToCard.className = 'btn btn-primary';
        addToCard.textContent = 'Add to card';
        const localProductId = localStorage.getItem(this.productId);
        if (localProductId) {
            price.classList.add('total');
            addToCard.className = 'btn btn-danger';
            addToCard.textContent = 'Drop from basket';
        } else {
            addToCard.className = 'btn btn-primary';
            addToCard.textContent = 'Add to basket';
        }
        addToCard.addEventListener('click', (event) => {
            event.preventDefault();
            if (localProductId) {
                localStorage.removeItem(this.productId);
                addToCard.textContent = 'Add to card';
                addToCard.className = 'btn btn-primary';
                if (localStorage.getItem('amount')) {
                    const newTotal = Math.abs(Number(localStorage.getItem('amount')) - this.currentProduct.price);
                    localStorage.setItem('amount', newTotal.toString());
                    const newCount = Math.abs(Number(localStorage.getItem('count')) - 1);
                    localStorage.setItem('count', newCount.toString());
                }
            } else {
                localStorage.setItem(this.productId, JSON.stringify(this.currentProduct));
                addToCard.textContent = 'Drop from cart';
                addToCard.className = 'btn btn-danger';
                if (localStorage.getItem('amount')) {
                    const newTotal = Math.abs(Number(localStorage.getItem('amount')) + this.currentProduct.price);
                    localStorage.setItem('amount', newTotal.toString());
                    const newCount = Math.abs(Number(localStorage.getItem('count')) + 1);
                    localStorage.setItem('count', newCount.toString());
                }
            }
            const totalPrice = document.getElementById('total-price') as HTMLDivElement;
            totalPrice.innerText = `${'Total cost: ' + localStorage.getItem('amount') + ' $'}`;
            const count = document.getElementById('count') as HTMLDivElement;
            count.innerText = `${localStorage.getItem('count')}`;
        });

        const buyNow = document.createElement('button');
        buyNow.className = 'btn btn-success';
        buyNow.textContent = 'Buy now';

        buttons.append(price, addToCard, buyNow);

        this.productContainer.append(breadcrumb, photos, aboutProduct, buttons);
    }
    load(): void {
        const loader = new Loader();
        loader.load().then((data) => {
            console.log('start loader');
            this.model.data = data;
            this.getCurrentProduct();
            this.renderProduct();
            this.container.append(this.productContainer);
        });
    }
    render() {
        this.load();
        return this.container;
    }
}

export default ItemPage;
