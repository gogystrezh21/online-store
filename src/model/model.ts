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
export interface IData {
    products: IProduct[];
}
export class Loader {
    load(): Promise<IData> {
        return fetch('./data.json')
            .then((res) => res.json())
            .then((data) => data);
    }
}
