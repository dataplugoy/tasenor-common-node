"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemePlugin = void 0;
const BackendPlugin_1 = require("./BackendPlugin");
/**
 * A plugin providing one or more accounting schemes.
 */
class SchemePlugin extends BackendPlugin_1.BackendPlugin {
    constructor(...schemes) {
        super();
        this.schemes = new Set(schemes);
    }
    /**
     * Check if this plugin has the given scheme.
     * @param code
     * @returns
     */
    hasScheme(code) {
        return this.schemes.has(code);
    }
    /**
     * Get the paths to the accounting scheme .tsv files by its code name.
     * @param code
     */
    getSchemePaths(code) {
        throw new Error(`A class ${this.constructor.name} does not implement getScheme().`);
    }
    /**
     * Get the default settings for the new database.
     * @param  code
     * @returns
     */
    getSchemeDefaults(code) {
        return {};
    }
    /**
     * Supported currencies.
     */
    supportedCurrencies() {
        return [];
    }
    /**
     * Supported languages.
     */
    supportedLanguages() {
        return [];
    }
}
exports.SchemePlugin = SchemePlugin;
//# sourceMappingURL=SchemePlugin.js.map