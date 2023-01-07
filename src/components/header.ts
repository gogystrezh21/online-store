import Component from './templates/components';

const Buttons = [
    {
        id: '/main-page',
        text: 'Main Page',
    },
    {
        id: '/basket-page',
        text: 'Basket Page',
    },
];

class Header extends Component {
    pageButtons: HTMLDivElement;
    constructor(tagName: string, className: string) {
        super(tagName, className);
    }

    renderPageButtons() {
        this.pageButtons = document.createElement('div');
        Buttons.forEach((button) => {
            const buttonHTML = document.createElement('a');
            buttonHTML.href = `#${button.id}`;
            buttonHTML.innerText = button.text;
            buttonHTML.className = 'header-buttons';
            this.pageButtons.append(buttonHTML);
        });
        this.container.append(this.pageButtons);
    }

    render() {
        this.renderPageButtons();
        const totalPrice = document.createElement('div');
        totalPrice.id = 'total-price';
        const amount = localStorage.getItem('amount');
        if (amount === null) {
            totalPrice.innerText = `${'Total price: ' + '0' + ' $'}`;
        } else {
            totalPrice.innerText = `${'Total price: ' + amount + '$'}`;
        }
        const header = this.pageButtons;
        const firstChild = header.querySelectorAll('a')[1] as HTMLElement;
        header.insertBefore(totalPrice, firstChild);

        const count = document.createElement('div');
        count.innerText = localStorage.getItem('count') ?? '0';

        count.id = 'count';
        firstChild.appendChild(count);
        return this.container;
    }
}

export default Header;
