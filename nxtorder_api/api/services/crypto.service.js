'use strict';

/** External modules **/
const crypto = require('crypto');

/** Internal modules **/
const config = require('../../config/');
const ENCRYPTION_KEY = config.cryptoKey;
const IV_LENGTH = 16; // For AES, this is always 16
const ALGORITHM = 'aes-256-cbc';
const ENCODING = 'hex';

module.exports = {

    encrypt: function (text) {

        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return iv.toString(ENCODING) + ':' + encrypted.toString(ENCODING);
    },

    decrypt: function (text) {

        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), ENCODING);
        let encryptedText = Buffer.from(textParts.join(':'), ENCODING);
        let decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }
};
