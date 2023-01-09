import MainPage from '../pages/main/index';
import Page from '../components/templates/page';
import BasketPage from './basket';
import ItemPage from './item';
import Header from '../components/header';
import ErrorPage from './error';
import { ErrorTypes } from '../types';
import { Model } from '../model/model';
import { Router } from './router';
import { ModalForm } from '../components/modal-form';
import { ITEM_PAGE_REGEXP } from '../constants/regexp';

class App {
    private static container: HTMLElement = document.body;
    private static defaultPageId = 'current-page';
    private initialPage: MainPage;
    private modalForm: ModalForm;
    private header: Header;
    private router: Router;

    static renderNewPage(idPage: string, router: Router, modalForm: ModalForm): void {
        const currentPageHTML = document.querySelector(`#${App.defaultPageId}`);
        if (currentPageHTML) {
            currentPageHTML.remove();
        }
        let page: Page | null = null;
        let matches: RegExpMatchArray | null;

        if (idPage === '/main-page') {
            page = App.createMainPage(idPage, router);
        } else if (idPage === '/basket-page') {
            page = new BasketPage(idPage, router, modalForm);
        } else if ((matches = idPage.match(ITEM_PAGE_REGEXP)) !== null) {
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
        window.addEventListener('hashchange', () => {
            this.router.update();
            App.renderNewPage(this.router.pathname, this.router, this.modalForm);
        });
    }

    constructor() {
        this.modalForm = ModalForm.fromDocument();
        this.router = new Router();
        this.initialPage = App.createMainPage('/main-page', this.router);
        this.header = new Header('header', 'header');
    }

    start() {
        App.container.append(this.header.render());
        App.renderNewPage(this.router.pathname, this.router, this.modalForm);
        this.enableRoute();
    }

    static createMainPage(id: string, router: Router): MainPage {
        const model = new Model();
        const page = new MainPage(id, model, router);
        return page;
    }
}

export default App;
