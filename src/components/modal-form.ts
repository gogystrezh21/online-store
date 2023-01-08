import { Modal } from 'bootstrap';

const modalForm = document.getElementById('modal-form');
const nameInput = document.getElementById('name') as HTMLInputElement;
const phoneNumber = document.getElementById('phone-number') as HTMLInputElement;
const deliveryAddress = document.getElementById('delivery-address') as HTMLInputElement;
const email = document.getElementById('e-mail') as HTMLInputElement;
const cardNumber = document.getElementById('card-number') as HTMLInputElement;
const code = document.getElementById('code') as HTMLInputElement;
const validThru = document.getElementById('valid-thru') as HTMLInputElement;
const cardImage = document.getElementById('card-image') as HTMLImageElement;
const modal = new Modal('#exampleModal');
const resultModal = new Modal('#resultModal', {
    backdrop: 'static',
    keyboard: false,
});

function setValid(m: RegExpMatchArray | null, element: HTMLInputElement) {
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
modalForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    let isValid = true;
    isValid = setValid(nameInput.value.match(/[a-z]{3,}(\s+[a-z]{3,}){1,}/gi), nameInput) && isValid;
    isValid = setValid(phoneNumber.value.match(/^\+([0-9]){9,}/), phoneNumber) && isValid;
    isValid = setValid(deliveryAddress.value.match(/^[a-z]{5,}(\s+[a-z]{5,}){2,}$/gi), deliveryAddress) && isValid;
    isValid =
        setValid(email.value.match(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/), email) &&
        isValid;
    isValid = setValid(cardNumber.value.match(/^\d{4} \d{4} \d{4} \d{4}$/), cardNumber) && isValid;
    isValid = setValid(validThru.value.match(/^(\d{2})\/?(\d{2})/), validThru) && isValid;
    isValid = setValid(code.value.match(/^[0-9]{3}$/), code) && isValid;

    if (isValid) {
        modal.hide();
        localStorage.clear();
        resultModal.show();
        const content = document.querySelector('.result-modal-content') as Element;
        let time = 3;
        setInterval(() => {
            time -= 1;
            content.textContent = `Order is processed. Go to the main page after ${time}`;
        }, 1000);
        setTimeout(() => {
            resultModal.hide();
            window.location.href = '/#/main-page';
            window.location.reload();
        }, 3000);
    }
});
nameInput.addEventListener('input', () => {
    setValid(nameInput.value.match(/[a-z]{3,}(\s+[a-z]{3,}){1,}/gi), nameInput);
});
phoneNumber.addEventListener('input', () => {
    let value = phoneNumber.value.replace(/[^\d+]/g, '');
    value = value.replace(/.\+/g, (s) => s[0]);
    phoneNumber.value = value;
    setValid(phoneNumber.value.match(/^\+([0-9]){9,}/), phoneNumber);
});
deliveryAddress.addEventListener('input', () => {
    setValid(deliveryAddress.value.match(/^[a-z]{5,}(\s+[a-z]{5,}){2,}$/gi), deliveryAddress);
});
email.addEventListener('input', () => {
    setValid(email.value.match(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/), email);
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
    setValid(cardNumber.value.match(/^\d{4} \d{4} \d{4} \d{4}$/), cardNumber);
});
code.addEventListener('input', () => {
    let value = code.value.replace(/[^\d]/g, '');
    const m = value.match(/^\d{3}/);
    if (m !== null) {
        value = m[0];
    }
    code.value = value;
    setValid(code.value.match(/^[0-9]{3}$/), code);
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
    setValid(validThru.value.match(/^(\d{2})\/?(\d{2})/), validThru);

    if (m !== null && (Number(m[2]) > 27 || Number(m[2]) < 23)) {
        validThru.classList.add('is-invalid');
        validThru.classList.remove('is-valid');
    }
});
