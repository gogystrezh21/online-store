import { Modal } from 'bootstrap';
import {
    ADDRESS_INPUT_REGEXP,
    CARD_NUMBER_INPUT_REGEXP,
    CODE_CARD_INPUT_REGEXP,
    EMAIL_INPUT_REGEXP,
    NAME_INPUT_REGEXP,
    PHONE_INPUT_REGEXP,
    VALID_THRU_INPUT_REGEXP,
} from '../constants/regexp';

export class ModalForm {
    private modal: Modal;
    private resultModal: Modal;

    public constructor(
        modalForm: HTMLFormElement,
        nameInput: HTMLInputElement,
        phoneNumber: HTMLInputElement,
        deliveryAddress: HTMLInputElement,
        email: HTMLInputElement,
        cardNumber: HTMLInputElement,
        code: HTMLInputElement,
        validThru: HTMLInputElement,
        cardImage: HTMLImageElement,
        modal: HTMLDivElement,
        resultModal: HTMLDivElement
    ) {
        this.modal = new Modal(modal);
        this.resultModal = new Modal(resultModal, {
            backdrop: 'static',
            keyboard: false,
        });

        modalForm?.addEventListener('submit', (event) => {
            event.preventDefault();

            let isValid = true;
            isValid = this.setValid(nameInput.value.match(NAME_INPUT_REGEXP), nameInput) && isValid;
            isValid = this.setValid(phoneNumber.value.match(PHONE_INPUT_REGEXP), phoneNumber) && isValid;
            const deliveryAddressMatches = deliveryAddress.value.match(ADDRESS_INPUT_REGEXP);
            isValid = this.setValid(deliveryAddressMatches, deliveryAddress) && isValid;
            const emailMatches = email.value.match(EMAIL_INPUT_REGEXP);
            isValid = this.setValid(emailMatches, email) && isValid;
            isValid = this.setValid(cardNumber.value.match(CARD_NUMBER_INPUT_REGEXP), cardNumber) && isValid;
            isValid = this.setValid(validThru.value.match(VALID_THRU_INPUT_REGEXP), validThru) && isValid;
            isValid = this.setValid(code.value.match(CODE_CARD_INPUT_REGEXP), code) && isValid;

            if (isValid) {
                this.modal.hide();
                localStorage.clear();
                this.resultModal.show();
                const content = document.querySelector('.result-modal-content') as Element;
                let time = 3;
                setInterval(() => {
                    time -= 1;
                    content.textContent = `Order is processed. Go to the main page after ${time}`;
                }, 1000);
                setTimeout(() => {
                    this.resultModal.hide();
                    window.location.href = '/#/main-page';
                    window.location.reload();
                }, 3000);
            }
        });

        nameInput.addEventListener('input', () => {
            this.setValid(nameInput.value.match(NAME_INPUT_REGEXP), nameInput);
        });

        phoneNumber.addEventListener('input', () => {
            let value = phoneNumber.value.replace(/[^\d+]/g, '');
            value = value.replace(/.\+/g, (s) => s[0]);
            phoneNumber.value = value;
            this.setValid(phoneNumber.value.match(PHONE_INPUT_REGEXP), phoneNumber);
        });

        deliveryAddress.addEventListener('input', () => {
            this.setValid(deliveryAddress.value.match(ADDRESS_INPUT_REGEXP), deliveryAddress);
        });

        email.addEventListener('input', () => {
            this.setValid(email.value.match(EMAIL_INPUT_REGEXP), email);
        });

        cardNumber.addEventListener('input', () => {
            let value = cardNumber.value.replace(/[^\d]/g, '');
            const m = value.match(/^\d{16}/);
            if (m !== null) {
                value = m[0];
            }
            value = value.replace(/\d{4}/g, (s) => s + ' ');
            cardNumber.value = value.trim();
            switch (cardNumber.value[0]) {
                case '4':
                    cardImage.src = './assets/visa.png';
                    break;
                case '5':
                    cardImage.src = './assets/mastercard.png';
                    break;
                case '6':
                    cardImage.src = './assets/belcard.png';
                    break;
                default:
                    cardImage.src = './assets/card.png';
            }
            this.setValid(cardNumber.value.match(CARD_NUMBER_INPUT_REGEXP), cardNumber);
        });

        code.addEventListener('input', () => {
            let value = code.value.replace(/[^\d]/g, '');
            const m = value.match(/^\d{3}/);
            if (m !== null) {
                value = m[0];
            }
            code.value = value;
            this.setValid(code.value.match(CODE_CARD_INPUT_REGEXP), code);
        });

        validThru.addEventListener('input', () => {
            const selectionOffset = validThru.selectionStart ?? 0;

            const value = validThru.value.replace(/[^\d]/g, '');
            const m = value.match(/^(\d{2})\/?(\d{2})/);
            if (m !== null) {
                if (Number(m[1]) > 12) {
                    m[1] = '12';
                }
                validThru.value = `${m[1]}/${m[2]}`;
            }

            validThru.selectionStart = selectionOffset + 1;
            validThru.selectionEnd = validThru.selectionStart;
            this.setValid(validThru.value.match(VALID_THRU_INPUT_REGEXP), validThru);

            if (m !== null && (Number(m[2]) > 27 || Number(m[2]) < 23)) {
                validThru.classList.add('is-invalid');
                validThru.classList.remove('is-valid');
            }
        });
    }

    public show(): void {
        this.modal.show();
    }

    private setValid(m: RegExpMatchArray | null, element: HTMLInputElement): boolean {
        const isValid = m !== null;
        if (isValid) {
            element.classList.add('is-valid');
            element.classList.remove('is-invalid');
        } else {
            element.classList.add('is-invalid');
            element.classList.remove('is-valid');
        }

        return isValid;
    }

    public static fromDocument(): ModalForm {
        const modalForm = document.getElementById('modal-form') as HTMLFormElement;
        const nameInput = document.getElementById('name') as HTMLInputElement;
        const phoneNumber = document.getElementById('phone-number') as HTMLInputElement;
        const deliveryAddress = document.getElementById('delivery-address') as HTMLInputElement;
        const email = document.getElementById('e-mail') as HTMLInputElement;
        const cardNumber = document.getElementById('card-number') as HTMLInputElement;
        const code = document.getElementById('code') as HTMLInputElement;
        const validThru = document.getElementById('valid-thru') as HTMLInputElement;
        const cardImage = document.getElementById('card-image') as HTMLImageElement;
        const modal = document.getElementById('exampleModal') as HTMLDivElement;
        const resultModal = document.getElementById('resultModal') as HTMLDivElement;

        return new ModalForm(
            modalForm,
            nameInput,
            phoneNumber,
            deliveryAddress,
            email,
            cardNumber,
            code,
            validThru,
            cardImage,
            modal,
            resultModal
        );
    }
}
