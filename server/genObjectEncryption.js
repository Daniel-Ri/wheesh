const { encrypt } = require("./utils/handleCrypto");

const originalObject = require(process.argv[2]);
const encryptedText = encrypt(JSON.stringify(originalObject));

console.log('Encrypted Text:', encryptedText);