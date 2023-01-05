import Page from '../../components/templates/page';
import { Loader, Model } from '../../model/model';
import { IProduct } from '../../types';

class BasketPage extends Page {
    static TextObject = {
        MainTitle: 'Basket Page',
    };
    productId: string;
    model: Model;
    currentProduct: IProduct;
    productContainer: HTMLDivElement;

    constructor(id: string) {
        super(id);
        this.model = new Model();
        this.currentProduct;
        this.productContainer;
    }

    getBasketProducts() {
        console.log('start current product');
        const products = this.model.data?.products;
        console.log(this.model.data?.products);
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
        console.log({ ...localStorage });
        console.log(Object.values({ ...localStorage }));
        // const text = localStorage.getItem('1');
        // console.log(JSON.parse(text));
        console.log(JSON.parse(localStorage.getItem('1')!) as IProduct); //вот этой строкой получаем значение по ключу 1, но нам надо проверить все ключи (1, 2 и тд до 25)
        // console.log(Array.from({ ...localStorage }));
        // console.log(Object.fromEntries(Array.from({ ...localStorage })));

        const breadcrumbArray = [{ text: 'Store', link: '#/main-page' }];
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
        img.alt = 'Slide';
        currentImg.append(img);

        const miniPhotos = document.createElement('ul');
        miniPhotos.className = 'col-4';

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

        aboutProduct.append(description, discountPercentage, rating, stock);

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
            this.getBasketProducts();
            this.renderProduct();
            this.container.append(this.productContainer);
        });
    }
    render() {
        this.load();
        return this.container;
    }
}

export default BasketPage;
