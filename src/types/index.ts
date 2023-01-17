export const enum ErrorTypes {
    Error_404 = 404,
}

export const enum FirstNumber {
    visa = '4',
    mastercard = '5',
    belcard = '6',
}

export const enum GitHubLinks {
    vlada = 'vladislava96',
    george = 'gogystrezh21'
}

export const enum BasketText {
    promos = 'Added Promos:',
    rsPromo = 'Rolling-Scopes -10%',
    summaryText = 'Summary',
    addText = 'Add',
    dropText = 'Drop',
    productsBasket = 'Products in basket',
    emptyBasket = 'Basket is empty!',
    buyNow = 'Buy now',
    minusSign = '-',
    plusSing = '+'
}

export const enum ItemText {
    addToCardText = 'Add to card',
    dropFromCardText = 'Drop from cart',
}

export const enum MainText {
    categoriesText = 'Categories:',
    brandText = 'Brands:',
    priceText = 'Price:',
    stockPrice = 'Stock:',
}

export interface IProduct {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export interface IRange {
    min: number;
    max: number;
}
export interface IData {
    products: IProduct[];
    brands: string[];
    categories: string[];
    price: IRange;
    stock: IRange;
}
