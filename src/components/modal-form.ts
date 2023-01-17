import { Modal } from 'bootstrap';
import {
    belcardSrc,
    cardSrc,
    mastercardSrc,
    visaSrc,
    maxExpirationDate,
    maxMonthNumber,
    minExpirationDate,
} from '../constants/constants';
import {
    ADDRESS_INPUT_REGEXP,
    CARD_NUMBER_INPUT_REGEXP,
    CARD_NUMBER_WITHOUT_SPACES_REGEXP,
    CODE_CARD_INPUT_REGEXP,
    EMAIL_INPUT_REGEXP,
    NAME_INPUT_REGEXP,
    NOT_NUMBER_AND_NOT_PLUS_REGEXP,
    NOT_NUMBER_REGEXP,
    PART_CARD_NUMBER_REGEXP,
    PHONE_INPUT_REGEXP,
    SYMBOL_AND_PLUS_REGEXP,
    VALID_THRU_INPUT_REGEXP,
} from '../constants/regexp';
import { FirstNumber } from '../types';

export class ModalForm {
    private _modal: Modal;
    private _resultModal: Modal;

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
        this._modal = new Modal(modal);
        this._resultModal = new Modal(resultModal, {
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

            if (!isValid) return;

            this._modal.hide();
            localStorage.clear();
            this._resultModal.show();
            const content = document.querySelector('.result-modal-content') as Element;
            let time = 3;
            setInterval(() => {
                time -= 1;
                content.textContent = `Order is processed. Go to the main page after ${time}`;
            }, 1000);
            setTimeout(() => {
                this._resultModal.hide();
                window.location.href = '/#/main-page';
                window.location.reload();
            }, 3000);
        });

        nameInput.addEventListener('input', () => {
            this.setValid(nameInput.value.match(NAME_INPUT_REGEXP), nameInput);
        });

        phoneNumber.addEventListener('input', () => {
            let value = phoneNumber.value.replace(NOT_NUMBER_AND_NOT_PLUS_REGEXP, '');
            value = value.replace(SYMBOL_AND_PLUS_REGEXP, (s) => s[0]);
            phoneNumber.value = value;
            this.setValid(phoneNumber.value.match(PHONE_INPUT_REGEXP), phoneNumber);
        });

        deliveryAddress.addEventListener('input', () => {
            const matches = deliveryAddress.value.match(ADDRESS_INPUT_REGEXP);
            const addressInputMaxWords = 3;
            const isValid = Array.isArray(matches) && matches.length >= addressInputMaxWords;
            this.setValid(isValid, deliveryAddress);
        });

        email.addEventListener('input', () => {
            this.setValid(email.value.match(EMAIL_INPUT_REGEXP), email);
        });

        cardNumber.addEventListener('input', () => {
            let value = cardNumber.value.replace(NOT_NUMBER_REGEXP, '');
            const matches = value.match(CARD_NUMBER_WITHOUT_SPACES_REGEXP);
            if (matches !== null) {
                value = matches[0];
            }
            value = value.replace(PART_CARD_NUMBER_REGEXP, (s) => s + ' ');
            cardNumber.value = value.trim();

            switch (cardNumber.value[0]) {
                case FirstNumber.visa:
                    cardImage.src = visaSrc;
                    break;
                case FirstNumber.mastercard:
                    cardImage.src = mastercardSrc;
                    break;
                case FirstNumber.belcard:
                    cardImage.src = belcardSrc;
                    break;
                default:
                    cardImage.src = cardSrc;
            }
            this.setValid(cardNumber.value.match(CARD_NUMBER_INPUT_REGEXP), cardNumber);
        });

        code.addEventListener('input', () => {
            let value = code.value.replace(NOT_NUMBER_REGEXP, '');
            const matches = value.match(CODE_CARD_INPUT_REGEXP);
            if (matches !== null) {
                value = matches[0];
            }
            code.value = value;
            this.setValid(code.value.match(CODE_CARD_INPUT_REGEXP), code);
        });

        validThru.addEventListener('input', () => {
            let selectionOffset = validThru.selectionStart ?? 0;

            const value = validThru.value.replace(NOT_NUMBER_REGEXP, '');
            const matches = value.match(VALID_THRU_INPUT_REGEXP);
            if (matches !== null) {
                if (Number(matches[1]) > maxMonthNumber) {
                    matches[1] = `${maxMonthNumber}`;
                }
                validThru.value = `${matches[1]}/${matches[2]}`;
            } else {
                validThru.value = value;
            }
            validThru.selectionStart = ++selectionOffset;
            validThru.selectionEnd = validThru.selectionStart;
            this.setValid(validThru.value.match(VALID_THRU_INPUT_REGEXP), validThru);

            if (
                matches !== null &&
                (Number(matches[2]) > maxExpirationDate || Number(matches[2]) < minExpirationDate)
            ) {
                validThru.classList.remove('is-valid');
                validThru.classList.add('is-invalid');
            }
        });
    }

    public show(): void {
        this._modal.show();
    }

    private setValid(matchesOrIsValid: RegExpMatchArray | boolean | null, element: HTMLInputElement): boolean {
        const isValid = matchesOrIsValid !== null && matchesOrIsValid !== false;

        const classToAdd = isValid ? 'is-valid' : 'is-invalid';
        const classToRemove = isValid ? 'is-invalid' : 'is-valid';

        element.classList.add(classToAdd);
        element.classList.remove(classToRemove);

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
        const validUntil = document.getElementById('valid-thru') as HTMLInputElement;
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
            validUntil,
            cardImage,
            modal,
            resultModal
        );
    }
}
