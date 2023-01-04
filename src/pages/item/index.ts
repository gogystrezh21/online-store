import Page from '../../components/templates/page';
import { Loader, Model } from '../../model/model';
import { IProduct } from '../../types';

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
            a.href = obj.link;
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
            li.style.height = '100px';
            li.style.width = '100px';
            img.style.maxHeight = '100px';
            img.style.maxWidth = '100px';
            img.src = url;
            img.alt = 'Slide';
            img.addEventListener('click', (event) => {
                currentImg.innerHTML = '';
                const img = document.createElement('img');
                const target = event.target as HTMLImageElement;
                img.src = target.src;
                img.alt = 'Slide';
                img.style.width = '100%';
                currentImg.append(img);
            });
            li.append(img);
            miniPhotos.append(li);
        }

        photosContainer.append(miniPhotos, currentImg);

        const aboutProduct = document.createElement('div');
        aboutProduct.className = 'col-3';

        const description = document.createElement('div');
        description.textContent = 'Description: ' + this.currentProduct.description;
        const discountPercentage = document.createElement('div');
        discountPercentage.textContent = 'Discount Percentage: ' + this.currentProduct.discountPercentage.toString();
        const rating = document.createElement('div');
        rating.textContent = 'Rating: ' + this.currentProduct.rating.toString() + '☆';
        const stock = document.createElement('div');
        stock.textContent = 'Stock: ' + this.currentProduct.stock.toString();
        const brand = document.createElement('div');
        brand.textContent = 'Brand: ' + this.currentProduct.brand;
        const category = document.createElement('div');
        category.textContent = 'Category: ' + this.currentProduct.category;

        aboutProduct.append(description, discountPercentage, rating, stock, brand, category);

        const buttons = document.createElement('div');
        buttons.className = 'col-3';

        const price = document.createElement('div');
        price.textContent = '€' + this.currentProduct.price.toString();

        const addToCard = document.createElement('button');
        addToCard.className = 'btn btn-primary';
        addToCard.textContent = 'Add to card';
        addToCard.addEventListener('click', () => {
            if (addToCard.textContent === 'Add to card') {
                addToCard.textContent = 'Drop from cart';
            } else if (addToCard.textContent === 'Drop from cart') {
                addToCard.textContent = 'Add to card';
            }
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
