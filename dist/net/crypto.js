"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUuid = exports.randomString = exports.Password = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Utility to create and check hashes from passwords.
 */
class Password {
    /**
     * Create one way hash for a password.
     * @param password A password.
     * @returns
     */
    static async hash(password) {
        const salt = await bcrypt_1.default.genSalt(13);
        const hash = await bcrypt_1.default.hash(password, salt);
        return hash;
    }
    /**
     * Verify that given hash has been created from the given password.
     * @param password
     * @param hash
     * @returns
     */
    static async compare(password, hash) {
        return await bcrypt_1.default.compare(password, hash);
    }
}
exports.Password = Password;
/**
 * Generate a random string of the given length.
 * @param len
 */
function randomString(len = 32) {
    const buf = crypto_1.default.randomBytes(len / 2);
    return buf.toString('hex');
}
exports.randomString = randomString;
/**
 * Generate UUID.
 * @returns A string.
 */
function createUuid() {
    function randomDigit() {
        const rand = crypto_1.default.randomBytes(1);
        return (rand[0] % 16).toString(16);
    }
    return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/x/g, randomDigit);
}
exports.createUuid = createUuid;
//# sourceMappingURL=crypto.js.map