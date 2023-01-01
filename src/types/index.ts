export const enum ErrorTypes {
    Error_404 = 404,
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
