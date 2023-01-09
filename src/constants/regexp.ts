const ROOT_URL_REGEXP = /^\/?$/;
const ITEM_PAGE_REGEXP = /^\/item-page\/(\d+)$/;
const HASH_STARTED_REGEXP = /^#/;
const NOT_NUMBER_STARTED_REGEXP = /[^0-9]/g;

const NAME_INPUT_REGEXP = /[a-z]{3,}(\s+[a-z]{3,}){1,}/gi;
const PHONE_INPUT_REGEXP = /^\+([0-9]){9,}/;
const ADDRESS_INPUT_REGEXP = /^[a-z]{5,}(\s+[a-z]{5,}){2,}$/gi;
const EMAIL_INPUT_REGEXP = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const CARD_NUMBER_INPUT_REGEXP = /^\d{4} \d{4} \d{4} \d{4}$/;
const VALID_THRU_INPUT_REGEXP = /^(\d{2})\/?(\d{2})/;
const CODE_CARD_INPUT_REGEXP = /^[0-9]{3}$/;

export {
    ROOT_URL_REGEXP,
    ITEM_PAGE_REGEXP,
    HASH_STARTED_REGEXP,
    NOT_NUMBER_STARTED_REGEXP,
    NAME_INPUT_REGEXP,
    PHONE_INPUT_REGEXP,
    ADDRESS_INPUT_REGEXP,
    EMAIL_INPUT_REGEXP,
    CARD_NUMBER_INPUT_REGEXP,
    VALID_THRU_INPUT_REGEXP,
    CODE_CARD_INPUT_REGEXP,
};
