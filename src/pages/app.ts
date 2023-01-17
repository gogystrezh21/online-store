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
    private static _container: HTMLElement = document.body;
    private static _defaultPageId = 'current-page';
    private _initialPage: MainPage;
    private _modalForm: ModalForm;
    private _header: Header;
    private _router: Router;

    static renderNewPage(idPage: string, router: Router, modalForm: ModalForm): void {
        const currentPageHTML = document.querySelector(`#${App._defaultPageId}`);
        if (currentPageHTML) {
            currentPageHTML.remove();
        }
        let page: Page | null = null;
        let matches: RegExpMatchArray | null;
        // let matches: RegExpMatchArray | null = null;

        // switch (true) {
        //     case idPage === '/main-page':
        //         page = App.createMainPage(idPage, router);
        //         break;
        //     case idPage === '/basket-page':
        //         page = new BasketPage(idPage, router, modalForm);
        //         break;
        //     case (matches = idPage.match(ITEM_PAGE_REGEXP)) != null:
        //         const productId = matches[1];
        //         page = new ItemPage(idPage, productId );
        //         break;
        //     default:
        //         page = new ErrorPage(idPage, ErrorTypes.Error_404);
        // }

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
            pageHTML.id = App._defaultPageId;
            App._container.append(pageHTML);
        }
    }

    private enableRoute() {
        window.addEventListener('hashchange', () => {
            this._router.update();
            App.renderNewPage(this._router.pathname, this._router, this._modalForm);
        });
    }

    constructor() {
        this._modalForm = ModalForm.fromDocument();
        this._router = new Router();
        this._initialPage = App.createMainPage('/main-page', this._router);
        this._header = new Header('header', 'header');
    }

    start() {
        App._container.append(this._header.render());
        App.renderNewPage(this._router.pathname, this._router, this._modalForm);
        this.enableRoute();
    }

    static createMainPage(id: string, router: Router): MainPage {
        const model = new Model();
        const page = new MainPage(id, model, router);
        return page;
    }
}

export default App;
