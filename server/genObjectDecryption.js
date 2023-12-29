const { decrypt } = require("./utils/handleCrypto");

const originalText = process.argv[2];
const decryptedObject = JSON.parse(decrypt(originalText));

console.log('Decrypted Object:', decryptedObject);