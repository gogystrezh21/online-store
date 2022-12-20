import Page from '../../components/templates/page';
import { ErrorTypes } from '../../types';

class ErrorPage extends Page {
    private errorType: ErrorTypes | string;

    static TextObject: { [prop: string]: string } = {
        '404': 'Error! The page was not found.',
    };

    constructor(id: string, errorType: ErrorTypes | string) {
        super(id);
        this.errorType = errorType;
    }

    render() {
        const title = this.createTitle(ErrorPage.TextObject[this.errorType]);
        this.container.append(title);
        return this.container;
    }
}

export default ErrorPage;
