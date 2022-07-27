"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasenorStack = exports.tasenorFinalStack = exports.tasenorInitialStack = exports.cleanUrl = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const tasenor_common_1 = require("@dataplug/tasenor-common");
const tokens_1 = require("./tokens");
const vault_1 = require("./vault");
const helmet_1 = __importDefault(require("helmet"));
/**
 * Hide tokens from URL.
 * @param url
 */
function cleanUrl(url) {
    return url.replace(/\btoken=[^&]+\b/, 'token=xxxx');
}
exports.cleanUrl = cleanUrl;
/**
 * Construct standard initial part of stack of commonly shared middlewares.
 */
function tasenorInitialStack(args) {
    const stack = [];
    // Add logger.
    stack.push((req, res, next) => {
        if (req.method !== 'OPTIONS') {
            let owner;
            const token = tokens_1.tokens.get(req);
            if (token) {
                const payload = tokens_1.tokens.parse(token);
                if (payload && payload.payload && payload.payload.data) {
                    owner = payload.payload.data.owner;
                    let aud = payload.payload.aud;
                    if (payload.payload.aud === 'refresh') {
                        aud = payload.payload.data.audience;
                    }
                    switch (aud) {
                        case 'sites':
                            owner = `Site ${owner}`;
                            break;
                        case 'bookkeeping':
                            owner = `User ${owner}`;
                            break;
                    }
                }
            }
            const user = owner ? `${owner} from ${req.ip}` : `${req.ip}`;
            const message = `${user} ${req.method} ${req.hostname} ${cleanUrl(req.originalUrl)}`;
            (0, tasenor_common_1.log)(message);
        }
        next();
    });
    // Add cors.
    stack.push((0, cors_1.default)({ origin: args.origin }));
    // Add helmet.
    let contentSecurityPolicy;
    if (args.api) {
        const apiOrigin = new URL(args.api).origin;
        contentSecurityPolicy = {
            useDefaults: true,
            directives: {
                defaultSrc: ["'self'", apiOrigin],
                imgSrc: ["'self'", 'data:', apiOrigin],
                scriptSrc: ["'self'", "'unsafe-eval'"]
            }
        };
    }
    else {
        contentSecurityPolicy = false;
    }
    stack.push((0, helmet_1.default)({
        contentSecurityPolicy
    }));
    return stack;
}
exports.tasenorInitialStack = tasenorInitialStack;
/**
 * Construct standard final part of stack of commonly shared middlewares.
 */
function tasenorFinalStack() {
    const stack = [];
    // Add error catcher.
    stack.push((err, req, res, next) => {
        (0, tasenor_common_1.error)('Internal error:', err);
        if (res.headersSent) {
            return next(err);
        }
        res.status(500).send({ message: 'Internal server error.' });
        const message = `${req.ip} ${req.method} ${req.hostname} ${cleanUrl(req.originalUrl)} => ${res.statusCode}`;
        (0, tasenor_common_1.error)(message);
    });
    return stack;
}
exports.tasenorFinalStack = tasenorFinalStack;
/**
 * A constructor for tasenor middleware stack based on the arguments.
 *
 * Each flag adds one or more functions to the stack returned.
 *
 * Flags:
 * - `url` Urlenconder parser.
 * - `json` JSON body parser.
 * - `token` Look for token from the request, but do not verify it yet.
 * - `user` Check that user token is present and for bookkeeper.
 * - `uuid` Check that UUID header is present and parse owner from the token. Verify signature of the token for ANY audience.
 * - `admin` Check that the valid bookkeeper user token exists and has admin feat.
 * - `superuser` Check that the valid bookkeeper user token exists and has superuser feat.
 * - `audience` The token audience to check token against (user or admin implies 'bookkeeper' unless explicitly given).
 * - `upload` If set, allow much bigger body for request.
 *
 * The output on the res.locals is:
 *
 * - `token` Raw token string.
 * - `auth` Content of the token if verified.
 * - `user` Name of the owner of the token if verified,
 * - `uuid` If X-UUID header was found, the value of it.
 * - `owner` Set when UUID is found and token signed for ANY audience.
 */
function tasenorStack({ url, json, user, uuid, admin, superuser, audience, token, upload }) {
    const stack = [];
    // Set automatic up implications.
    if (superuser) {
        admin = true;
    }
    if (admin) {
        user = true;
    }
    if (user && !audience) {
        audience = 'bookkeeping';
    }
    if (audience) {
        token = true;
    }
    if (uuid) {
        token = true;
    }
    // Add some space for upload.
    const params = {};
    if (upload) {
        params.limit = tasenor_common_1.MAX_UPLOAD_SIZE;
    }
    // Add URL encoding middleware.
    if (url || (upload && !url && !json)) {
        stack.push(express_1.default.urlencoded({ extended: true, ...params }));
    }
    // Add JSON middleware.
    if (json) {
        stack.push(express_1.default.json({ ...params }));
    }
    // Find the token.
    if (token) {
        stack.push(async (req, res, next) => {
            res.locals.token = tokens_1.tokens.get(req);
            next();
        });
    }
    // Set the UUID and owner.
    if (uuid) {
        stack.push(async (req, res, next) => {
            if (!res.locals.token) {
                (0, tasenor_common_1.error)('There is no token in the request and we are looking for UUID.');
                return res.status(403).send({ message: 'Forbidden.' });
            }
            const uuid = req.headers['x-uuid'];
            if (!uuid) {
                (0, tasenor_common_1.error)('Cannot find UUID from the request.');
                return res.status(403).send({ message: 'Forbidden.' });
            }
            const payload = tokens_1.tokens.parse(res.locals.token);
            if (!payload) {
                (0, tasenor_common_1.error)(`Cannot parse payload from the token ${res.locals.token}`);
                return res.status(403).send({ message: 'Forbidden.' });
            }
            const audience = payload.payload.aud;
            const secret = vault_1.vault.getPrivateSecret();
            const ok = tokens_1.tokens.verify(res.locals.token, secret, audience);
            if (!ok) {
                (0, tasenor_common_1.error)(`Failed to verify token ${res.locals.token} for audience ${audience}.`);
                return res.status(403).send({ message: 'Forbidden.' });
            }
            res.locals.uuid = uuid;
            res.locals.owner = ok.owner;
            next();
        });
    }
    // Add token check middleware.
    if (audience) {
        stack.push(async (req, res, next) => {
            const token = res.locals.token;
            if (!token) {
                (0, tasenor_common_1.error)(`Request ${req.method} ${cleanUrl(req.originalUrl)} from ${req.ip} has no token.`);
                res.status(401).send({ message: 'Unauthorized.' });
                return;
            }
            const secret = audience === 'refresh' ? await vault_1.vault.get('SECRET') : vault_1.vault.getPrivateSecret();
            if (!secret) {
                (0, tasenor_common_1.error)('Cannot find SECRET.');
                return res.status(500).send({ message: 'Unable to handle authorized requests at the moment.' });
            }
            if (!audience) {
                return res.status(500).send({ message: 'Internal error.' });
            }
            const payload = tokens_1.tokens.verify(token, secret, audience);
            if (!payload) {
                (0, tasenor_common_1.error)(`Request from ${req.ip} has bad token ${token}`);
                return res.status(403).send({ message: 'Forbidden.' });
            }
            // Check admin.
            if (admin && !payload.feats.ADMIN && !payload.feats.SUPERUSER) {
                (0, tasenor_common_1.error)(`Request denied for admin access to ${JSON.stringify(payload)}`);
                return res.status(403).send({ message: 'Forbidden.' });
            }
            // Check superuser.
            if (superuser && !payload.feats.SUPERUSER) {
                (0, tasenor_common_1.error)(`Request denied for superuser access to ${JSON.stringify(payload)}`);
                return res.status(403).send({ message: 'Forbidden.' });
            }
            res.locals.auth = payload;
            res.locals.user = payload.owner;
            next();
        });
    }
    return stack;
}
exports.tasenorStack = tasenorStack;
//# sourceMappingURL=middleware.js.map