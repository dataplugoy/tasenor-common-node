import { Currency, Language, SchemeName, TsvFilePath } from '@dataplug/tasenor-common';
import { BackendPlugin } from './BackendPlugin';
/**
 * A plugin providing one or more accounting schemes.
 */
export declare class SchemePlugin extends BackendPlugin {
    private schemes;
    constructor(...schemes: SchemeName[]);
    /**
     * Check if this plugin has the given scheme.
     * @param code
     * @returns
     */
    hasScheme(code: any): boolean;
    /**
     * Get the paths to the accounting scheme .tsv files by its code name.
     * @param code
     */
    getSchemePaths(code: any, languae: any): TsvFilePath[];
    /**
     * Get the default settings for the new database.
     * @param  code
     * @returns
     */
    getSchemeDefaults(code: any): Record<string, unknown>;
    /**
     * Supported currencies.
     */
    supportedCurrencies(): Currency[];
    /**
     * Supported languages.
     */
    supportedLanguages(): Language[];
}
