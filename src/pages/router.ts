export class Router {
    private url: URL;

    constructor() {
        this.update();
        this.url.pathname = '/main-page';
    }

    get pathname(): string {
        return this.url.pathname;
    }

    getQueryParam(key: string): string | null {
        return this.url.searchParams.get(key);
    }

    getQueryParams(key: string): string[] {
        return this.url.searchParams.getAll(key);
    }

    setQueryParam(key: string, value: string | string[]) {
        if (Array.isArray(value)) {
            this.url.searchParams.delete(key);
            for (const item of value) {
                this.url.searchParams.append(key, item);
            }
        } else {
            this.url.searchParams.set(key, value);
        }
        const newUrl = '#' + this.url.pathname + this.url.search;
        console.log(this.url.pathname);

        window.history.replaceState({}, '', newUrl);
    }

    update() {
        this.url = new URL(window.location.hash.replace(/^#/, ''), window.location.protocol + window.location.host);
    }
}
