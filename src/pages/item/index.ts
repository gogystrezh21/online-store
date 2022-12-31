import Page from '../../components/templates/page';

class ItemPage extends Page {
    static TextObject = {
        MainTitle: 'Item Page',
    };

    constructor(id: string) {
        super(id);
    }

    render() {
        const title = this.createTitle(ItemPage.TextObject.MainTitle);
        this.container.append(title);
        return this.container;
    }
}

export default ItemPage;
