import config from '@config/index';
import CryptoJS from 'crypto-js';

const KEY = config.api.cryptoKey;

export const encrypt = (text) => CryptoJS.AES.encrypt(text, KEY).toString();

export const decrypt = (text) => {
  try {
    return CryptoJS.AES.decrypt(text, KEY).toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
};
