import Page from '../../components/templates/page';

class BasketPage extends Page {
    static TextObject = {
        MainTitle: 'Basket Page',
    };

    constructor(id: string) {
        super(id);
    }

    render() {
        const title = this.createTitle(BasketPage.TextObject.MainTitle);
        this.container.append(title);
        return this.container;
    }
}

export default BasketPage;
