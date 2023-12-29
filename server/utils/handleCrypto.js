require("dotenv").config();
const CryptoJS = require("crypto-js");

const KEY = process.env.CRYPTO_KEY;

exports.encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, KEY).toString();
}

exports.decrypt = (text) => {
  try {
    return CryptoJS.AES.decrypt(text, KEY).toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
}