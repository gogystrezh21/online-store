import Component from './templates/components';
import { GitHubLinks } from '../types/index';
import '../assets/rs_school_js.svg';

class Footer extends Component {
    constructor(tagName: string, className: string) {
        super(tagName, className);
    }

    render() {
        const footerContainer = document.createElement('footer');
        document.body.append(footerContainer);
        const footer = document.createElement('div');
        footer.classList.add('link-container');
        this.container.append(footer);
        const linkVlada = document.createElement('a');
        linkVlada.classList.add('github');
        linkVlada.textContent = GitHubLinks.vlada;
        linkVlada.href = 'https://github.com/vladislava96';
        const linkGeorge = document.createElement('a');
        linkGeorge.classList.add('github');
        linkGeorge.textContent = GitHubLinks.george;
        linkGeorge.href = 'https://github.com/gogystrezh21';
        const year = document.createElement('p');
        year.textContent = '2023';
        year.classList.add('year');
        this.container.append(year);
        const logo = document.createElement('div');
        this.container.append(logo);
        const logoLink = document.createElement('a');
        logoLink.href = 'https://rs.school/js/';
        logo.append(logoLink);
        const logoImg = document.createElement('img');
        logoImg.classList.add('footer-rolling');
        logoImg.src = '../assets/rs_school_js.svg';
        logoLink.append(logoImg);
        footer.append(linkVlada);
        footer.append(linkGeorge);
        return this.container;
    }
}

export default Footer;
