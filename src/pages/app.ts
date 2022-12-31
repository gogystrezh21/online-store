import MainPage from '../pages/main/index';
import Page from '../components/templates/page';
import BasketPage from './basket';
import ItemPage from './item';
import { PagesIds } from '../types';
import Header from '../components/header';
import ErrorPage from './error';
import { ErrorTypes } from '../types';
// import JSON from '../data.json';
import { Model } from '../model/model';
import { Router } from './router';

class App {
    private static container: HTMLElement = document.body;
    private static defaultPageId = 'current-page';
    private initialPage: MainPage;
    private header: Header;
    private router: Router;

    static renderNewPage(idPage: string, router: Router) {
        // const itemId = JSON.products.map((el) => el.id);
        const currentPageHTML = document.querySelector(`#${App.defaultPageId}`);
        if (currentPageHTML) {
            currentPageHTML.remove();
        }
        let page: Page | null = null;

        if (idPage === PagesIds.MainPage) {
            page = App.createMainPage(idPage, router);
        } else if (idPage === PagesIds.BasketPage) {
            page = new BasketPage(idPage);
        } else if (idPage === PagesIds.ItemPage) {
            page = new ItemPage(idPage);
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
        this.initialPage = App.createMainPage(PagesIds.MainPage, this.router);
        this.header = new Header('header', 'header');
    }

    start() {
        console.log('App start');
        App.container.append(this.header.render());
        App.renderNewPage('/main-page', this.router);
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
