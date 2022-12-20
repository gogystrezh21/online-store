import Page from '../../components/templates/page';

class MainPage extends Page {
    static TextObject = {
        MainTitle: 'Main Page',
    };

    constructor(id: string) {
        super(id);
    }

    render() {
        const title = this.createTitle(MainPage.TextObject.MainTitle);
        this.container.append(title);
        return this.container;
    }
}

export default MainPage;
