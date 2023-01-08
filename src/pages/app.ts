import MainPage from '../pages/main/index';
import Page from '../components/templates/page';
import BasketPage from './basket';
import ItemPage from './item';
import Header from '../components/header';
import ErrorPage from './error';
import { ErrorTypes } from '../types';
import { Model } from '../model/model';
import { Router } from './router';
import { ITEM_PAGE_REGEXP } from '../constants/regexp';

class App {
    private static container: HTMLElement = document.body;
    private static defaultPageId = 'current-page';
    private initialPage: MainPage;
    private header: Header;
    private router: Router;

    static renderNewPage(idPage: string, router: Router) {
        const currentPageHTML = document.querySelector(`#${App.defaultPageId}`);
        if (currentPageHTML) {
            currentPageHTML.remove();
        }
        let page: Page | null = null;
        let matches: RegExpMatchArray | null;

        if (idPage === '/main-page') {
            page = App.createMainPage(idPage, router);
        } else if (idPage === '/basket-page') {
            page = new BasketPage(idPage);
        } else if ((matches = idPage.match(ITEM_PAGE_REGEXP)) !== null) {
            console.log(matches);
            const productId = matches[1];
            page = new ItemPage(idPage, productId);
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
        console.log('enableRoute');
        window.addEventListener('hashchange', () => {
            this.router.update();
            App.renderNewPage(this.router.pathname, this.router);
        });
    }

    constructor() {
        this.router = new Router();
        this.initialPage = App.createMainPage('/main-page', this.router);
        this.header = new Header('header', 'header');
    }

    start() {
        console.log('App start');
        App.container.append(this.header.render());
        App.renderNewPage(this.router.pathname, this.router);
        this.enableRoute();
    }

    static createMainPage(id: string, router: Router): MainPage {
        console.log('create main-page');
        const model = new Model();
        const page = new MainPage(id, model, router);
        return page;
    }
}

export default App;
