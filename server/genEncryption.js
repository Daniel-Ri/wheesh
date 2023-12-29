const { encrypt } = require("./utils/handleCrypto");

const originalText = process.argv[2];
const encryptedText = encrypt(originalText);

console.log('Encrypted Text:', encryptedText);