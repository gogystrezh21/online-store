import Page from '../../components/templates/page';
import { IData } from '../../model/model';
// import { PagesIds } from '../../types';

class MainPage extends Page {
    static TextObject = {
        MainTitle: 'Main Page',
    };

    private _data: IData | null = null;

    constructor(id: string) {
        super(id);
    }

    set data(data: IData) {
        this._data = data;
        this.rerender();
    }

    render() {
        const title = this.createTitle(MainPage.TextObject.MainTitle);
        this.container.append(title);

        const container = document.createElement('div');
        container.className = 'container';
        this.container.append(container);

        const containerRow = document.createElement('div');
        containerRow.className = 'row';
        container.append(containerRow);

        const filters = document.createElement('div');
        filters.className = 'col-4';
        containerRow.append(filters);

        const products = document.createElement('div');
        products.className = 'col-8';
        containerRow.append(products);

        const search = document.createElement('nav');
        search.className = 'navbar navbar-light bg-light';
        products.append(search);

        const form = document.createElement('form');
        form.className = 'form-inline';
        search.append(form);

        const input = document.createElement('input');
        input.className = 'form-control mr-sm-2';
        input.id = 'elastic';
        input.placeholder = 'Search product';
        form.append(input);

        const bigGrid = document.createElement('div');
        bigGrid.className = 'big active';
        search.append(bigGrid);
        const smallGrid = document.createElement('div');
        smallGrid.className = 'small';
        search.append(smallGrid);

        const productsGrid = document.createElement('div');
        productsGrid.className = 'row grid';
        products.append(productsGrid);

        if (this._data !== null) {
            for (const product of this._data.products) {
                const productCol = document.createElement('div');
                productCol.className = 'col-4';
                productsGrid.appendChild(productCol);

                const card = document.createElement('div');
                card.className = 'card';
                productCol.appendChild(card);

                const img = document.createElement('img');
                img.className = 'card-img-top';
                img.src = product.thumbnail;
                img.style.objectFit = 'cover';
                img.style.height = '200px';
                card.appendChild(img);

                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';
                card.appendChild(cardBody);

                const h5 = document.createElement('h5');
                h5.className = 'card-title';
                h5.textContent = product.title;
                cardBody.appendChild(h5);

                const p = document.createElement('p');
                p.className = 'card-text';
                p.textContent = product.description;
                cardBody.appendChild(p);

                let val = input?.value.trim().toLowerCase();
                const elasticItems = document.querySelectorAll<HTMLElement>('.row.grid>*');

                const searcher = () => {
                    if (val != '') {
                        elasticItems.forEach(function (elem) {
                            if (elem.innerText.toLowerCase().search(val) == -1) {
                                elem.classList.add('hide');
                            } else {
                                elem.classList.remove('hide');
                            }
                        });
                    } else {
                        elasticItems.forEach(function (elem) {
                            elem.classList.remove('hide');
                        });
                    }
                };

                bigGrid.addEventListener('click', () => {
                    smallGrid.classList.remove('active');
                    bigGrid.classList.add('active');
                    productCol.className = 'col-4';
                    localStorage.setItem('style', productCol.className);
                    img.style.height = '200px';
                    p.style.display = 'block';
                    h5.style.fontSize = '1.25rem';
                    searcher();
                });

                smallGrid.addEventListener('click', () => {
                    smallGrid.classList.add('active');
                    bigGrid.classList.remove('active');
                    productCol.className = 'col-2';
                    localStorage.setItem('style', productCol.className);
                    img.style.height = '100px';
                    p.style.display = 'none';
                    h5.style.fontSize = '14px';
                    searcher();
                });

                if (localStorage.getItem('style') === 'col-2') {
                    smallGrid.classList.add('active');
                    bigGrid.classList.remove('active');
                    productCol.className = 'col-2';
                    img.style.height = '100px';
                    p.style.display = 'none';
                    h5.style.fontSize = '14px';
                    searcher();
                } else {
                    productCol.className = 'col-4';
                    img.style.height = '200px';
                    p.style.display = 'block';
                    h5.style.fontSize = '1.25rem';
                    searcher();
                }

                input.oninput = function () {
                    // const url = '#' + PagesIds.MainPage + '&search?' + '=' + val;
                    val = input.value;
                    localStorage.setItem('formData', val);
                    searcher();
                    // location.href = url;
                };

                if (localStorage.getItem('formData')) {
                    input.value = localStorage.getItem('formData') as string;
                    searcher();
                }
            }
        }

        return this.container;
    }

    rerender() {
        this.container.innerHTML = '';
        this.render();
    }
}

export default MainPage;
