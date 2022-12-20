import MainPage from '../pages/main/index';
import Page from '../components/templates/page';
import BasketPage from './basket';
import { PagesIds } from '../types';
import Header from '../components/header';
import ErrorPage from './error';
import { ErrorTypes } from '../types';

class App {
    private static container: HTMLElement = document.body;
    private static defaultPageId = 'current-page';
    private initialPage: MainPage;
    private header: Header;

    static renderNewPage(idPage: string) {
        const currentPageHTML = document.querySelector(`#${App.defaultPageId}`);
        if (currentPageHTML) {
            currentPageHTML.remove();
        }
        let page: Page | null = null;

        if (idPage === PagesIds.MainPage) {
            page = new MainPage(idPage);
        } else if (idPage === PagesIds.BasketPage) {
            page = new BasketPage(idPage);
        } else {
            page = new ErrorPage(idPage, ErrorTypes.Error_404);
        }

        if (page) {
            const pageHTML = page.render();
            pageHTML.id = App.defaultPageId;
            App.container.append(pageHTML);
        }
    }

    private enableRoute() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            App.renderNewPage(hash);
        });
    }

    constructor() {
        this.initialPage = new MainPage('main-page');
        this.header = new Header('header', 'header');
    }

    start() {
        App.container.append(this.header.render());
        App.renderNewPage('main-page');
        this.enableRoute();
    }
}

export default App;
