const { decrypt } = require("./utils/handleCrypto");

const originalText = process.argv[2];
const decryptedText = decrypt(originalText);

console.log('Decrypted Text:', decryptedText);