"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokens = void 0;
const tasenor_common_1 = require("@dataplug/tasenor-common");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ts_opaque_1 = require("ts-opaque");
const vault_1 = require("./vault");
/**
 * Find a token from the request if available.
 * @param request A HTTP request.
 */
function get(request) {
    let token;
    if (request.query && request.query.token) {
        token = request.query.token;
    }
    else if (request.headers.authorization && /^Bearer /.test(request.headers.authorization)) {
        token = request.headers.authorization.substr(7);
    }
    return token;
}
/**
 * Sign the payload with the given secret.
 * @param payload
 * @param expires
 * @returns A JSON web token.
 */
async function sign(payload, audience, expires = 0) {
    const secret = audience === 'refresh' ? await vault_1.vault.get('SECRET') : vault_1.vault.getPrivateSecret();
    if (!secret) {
        throw new Error('Cannot fins secret to sign token.');
    }
    if (!expires) {
        expires = audience === 'refresh' ? tasenor_common_1.REFRESH_TOKEN_EXPIRY_TIME : tasenor_common_1.TOKEN_EXPIRY_TIME;
    }
    const options = {
        audience,
        expiresIn: expires,
        issuer: tasenor_common_1.TOKEN_ISSUER
    };
    const token = (0, ts_opaque_1.create)(jsonwebtoken_1.default.sign({ data: payload }, secret, options));
    return token;
}
/**
 * Sign both the normal token and refresh token for it.
 * @param payload
 * @param audience
 * @param expires
 */
async function sign2(payload, audience, expires = 0) {
    const token = await sign(payload, audience, expires);
    const refresh = await sign({ audience, owner: payload.owner, feats: payload.feats, plugins: payload.plugins }, 'refresh', expires * 2);
    return { token, refresh };
}
/**
 * Check the token validity.
 * @param token
 * @param secret
 * @param quiet If set, do not trigger errors.
 * @returns Token payload if valid.
 */
function verify(token, secret, audience, quiet = false) {
    if (!secret)
        throw new Error('Cannot verify token since no secret given.');
    if (!audience)
        throw new Error('Cannot verify token since no audience given.');
    function fail(msg) {
        if (!quiet)
            (0, tasenor_common_1.error)(msg);
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret, { audience, issuer: [tasenor_common_1.TOKEN_ISSUER] });
        if (!decoded) {
            fail('Cannot decode the token.');
        }
        else if (!decoded.data) {
            fail(`Cannot find any payload from the token ${token}.`);
        }
        else {
            if (!decoded.exp) {
                fail(`Token content ${decoded} does not have exp-field.`);
                return null;
            }
            if (decoded.data.audience) {
                const data = decoded.data;
                if (!data.owner || !data.feats) {
                    fail(`Cannot find proper payload from the refresh token with content ${JSON.stringify(decoded)}.`);
                    return null;
                }
                else {
                    return data;
                }
            }
            else {
                const data = decoded.data;
                if (!data.owner || !data.feats) {
                    fail(`Cannot find proper payload from the token with content ${JSON.stringify(decoded)}.`);
                    return null;
                }
                else {
                    return data;
                }
            }
        }
    }
    catch (err) {
        fail(`Token verification failed ${err} for ${JSON.stringify(parse(token))}`);
    }
    return null;
}
/**
 * Parse the payload of the token without verifying.
 * @param token
 */
function parse(token) {
    const decoded = jsonwebtoken_1.default.decode(token, { json: true, complete: true });
    return decoded;
}
/**
 * A checker for token validity.
 * @param token
 * @param audience
 * @param quiet If set, do not trigger errors.
 */
async function check(token, audience, quiet = false) {
    if (!token) {
        return false;
    }
    const secret = audience === 'refresh' ? await vault_1.vault.get('SECRET') : vault_1.vault.getPrivateSecret();
    if (!secret) {
        return false;
    }
    const payload = exports.tokens.verify(token, secret, audience, quiet);
    return !!payload;
}
exports.tokens = {
    check,
    get,
    parse,
    sign,
    sign2,
    verify
};
//# sourceMappingURL=tokens.js.map