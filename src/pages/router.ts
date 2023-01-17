import { HASH_STARTED_REGEXP, ROOT_URL_REGEXP } from '../constants/regexp';

export class Router {
    private _url: URL;

    constructor() {
        this.update();
        if (ROOT_URL_REGEXP.test(this._url.pathname)) {
            this._url.pathname = '/main-page';
        }
    }

    get pathname(): string {
        return this._url.pathname;
    }

    getQueryParam(key: string): string | null {
        return this._url.searchParams.get(key);
    }

    getQueryParams(key: string): string[] {
        return this._url.searchParams.getAll(key);
    }

    setQueryParam(key: string, value: string | string[]) {
        if (Array.isArray(value)) {
            this._url.searchParams.delete(key);
            for (const item of value) {
                this._url.searchParams.append(key, item);
            }
        } else {
            this._url.searchParams.set(key, value);
        }
        const newUrl = '#' + this._url.pathname + this._url.search;

        window.history.replaceState({}, '', newUrl);
    }

    update() {
        this._url = new URL(
            window.location.hash.replace(HASH_STARTED_REGEXP, ''),
            window.location.protocol + window.location.host
        );
    }
}
