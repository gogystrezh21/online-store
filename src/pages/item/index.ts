import Page from '../../components/templates/page';

class ItemPage extends Page {
    static TextObject = {
        MainTitle: 'Item Page',
    };
    productId: string;
    constructor(id: string, productId: string) {
        super(id);
        this.productId = productId;
    }

    render() {
        const title = this.createTitle(ItemPage.TextObject.MainTitle);
        this.container.append(title);
        return this.container;
    }
}

export default ItemPage;
