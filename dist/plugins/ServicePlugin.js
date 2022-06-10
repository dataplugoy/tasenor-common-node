"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePlugin = void 0;
const axios_1 = __importDefault(require("axios"));
const tasenor_common_1 = require("@dataplug/tasenor-common");
const BackendPlugin_1 = require("./BackendPlugin");
/**
 * An API end point provider.
 */
class ServicePlugin extends BackendPlugin_1.BackendPlugin {
    constructor(...services) {
        super();
        this.services = services;
    }
    getServices() {
        return this.services;
    }
    /**
     * A query executor called by the back end for API request.
     * @param best The currently best solution found.
     * @param db Knex database.
     * @param service Name of the service to called.
     * @param query Query parameters.
     * This calls the actual query function, handles errors and finally modifies `best` if found a solution.
     */
    async executeQuery(best, db, service, query) {
        const settings = {};
        for (const setting of await db('settings').select('*').where('name', 'like', `${this.code}.%`)) {
            const [, name] = setting.name.split('.');
            settings[name] = setting.value;
        }
        // First check if the current answer is adequate.
        if (this.isAdequate(best)) {
            return;
        }
        // Then run the query and catch errors.
        let result;
        try {
            result = await this.query(db, settings, service, query);
        }
        catch (err) {
            (0, tasenor_common_1.error)(`Exception when handling service ${service} query ${JSON.stringify(query)}: ${err}`);
            result = {
                status: 500,
                message: `Execution of service ${service} query failed on plugin ${this.constructor.name}.`
            };
        }
        // Combine result.
        this.addResult(best, result);
    }
    /**
     * Perform the actual query.
     *
     * @param db Knex database.
     * @param service Name of the service to called.
     * @param query Query parameters.
     */
    async query(db, settings, service, query) {
        throw new Error(`A service plugin ${this.constructor.name} does not implement query().`);
    }
    /**
     * Combine result of the service query.
     *
     * @param old Currently found solution.
     * @param latest The solution given by this plugin.
     *
     * By default, any 2xx status result will override the current result.
     * Any error result will override initial 404 result.
     * Otherwise the latest is ignored.
     */
    addResult(old, latest) {
        if ((latest.status >= 200 && latest.status < 300) ||
            (old.status === 404 && old.message === 'No handlers found.')) {
            delete old.message;
            Object.assign(old, latest);
        }
    }
    /**
     * Check if the current solution is sufficient.
     * By default, any status 2xx is sufficient.
     */
    isAdequate(solution) {
        return solution.status >= 200 && solution.status < 300;
    }
    /**
     * Execute query to the third party service,
     * @param service
     * @param method
     * @param url
     * @param params
     * @returns Result body.
     */
    async request(service, method, url, params, headers = {}) {
        if (method !== 'GET') {
            throw new Error('Only GET method currently supported in plugin requests.');
        }
        (0, tasenor_common_1.note)(`Service ${service} request ${method} ${url}`);
        return new Promise((resolve, reject) => {
            axios_1.default.request({ method, url, params, headers })
                .then(response => {
                (0, tasenor_common_1.log)(`Request ${method} ${url}: HTTP ${response.status}`);
                resolve({
                    status: response.status,
                    data: response.data
                });
            })
                .catch(err => {
                const status = err.response ? err.response.status : 500;
                const message = err.response && err.response.data && err.response.data.message ? err.response.data.message : `${err}`;
                (0, tasenor_common_1.error)(`Request ${method} ${url} failed: HTTP ${status} ${message}`);
                resolve({
                    status,
                    message
                });
            });
        });
    }
    /**
     * Pick meaningful keys unique from the headers for using as a key, whe storing result to teh cache.
     * @param service
     * @param header
     * By default, no header is used as cache key.
     */
    cacheHeadersKey(service, header) {
        return {};
    }
    /**
     * Pick meaningful keys unique from the query parameters for using as a key, whe storing result to teh cache.
     * @param service
     * @param params
     * By default, all parameters are used as cache key.
     */
    cacheParamsKey(service, params) {
        return params;
    }
    /**
     * Execute query to the third party service,
     * @param db
     * @param service
     * @param method
     * @param url
     * @param params
     * @returns Result body.
     */
    async cachedRequest(db, service, method, url, params, headers = {}, options = {}) {
        // Get cache keys.
        const keyParams = this.cacheParamsKey(service, params);
        const keyHeaders = this.cacheHeadersKey(service, headers);
        // Check if cached.
        const cached = db ? await db('cached_requests').select('status', 'result').where({ method, url, query: keyParams, headers: keyHeaders }).first() : null;
        if (cached) {
            if (cached.status >= 200 && cached.status < 300) {
                (0, tasenor_common_1.log)(`Using cached service ${service} result for ${method} ${url}`);
                return cached.result;
            }
        }
        // Add delay if needed.
        if (options.rateLimitDelay) {
            await (0, tasenor_common_1.waitPromise)(options.rateLimitDelay);
        }
        // Do the request and cache the result.
        const result = await this.request(service, method, url, params, headers);
        if (db) {
            await db('cached_requests').insert({ method, url, query: keyParams, headers: keyHeaders, status: result.status || null, result });
        }
        return result;
    }
}
exports.ServicePlugin = ServicePlugin;
//# sourceMappingURL=ServicePlugin.js.map