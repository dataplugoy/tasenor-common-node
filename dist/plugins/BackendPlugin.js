"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendPlugin = void 0;
const path_1 = __importDefault(require("path"));
const __1 = require("..");
/**
 * Baseclass for all plugins for back-end.
 */
class BackendPlugin {
    constructor() {
        this.id = null;
        this.code = '';
        this.title = '';
        this.version = null;
        this.releaseDate = null;
        this.use = 'unknown';
        this.type = 'unknown';
        this.icon = '';
        this.description = '';
        this.path = '';
        // Plugin translations from language code to the translation dictionary.
        this.languages = {};
    }
    /**
     * Hook to be executed once during installing.
     */
    async install() {
    }
    /**
     * Hook to be executed one during uninstalling.
     */
    async uninstall() {
    }
    /**
     * Hook to be executed once for every database during installing.
     * @param db Knex instance of the database.
     */
    async installToDb(db) {
    }
    /**
     * Hook to be executed once for every database during uninstalling.
     * @param db Knex instance of the database.
     */
    async uninstallFromDb(db) {
    }
    /**
     * Get the full path to the directory of this plugin.
     * @returns The path.
     */
    get fullPath() {
        return path_1.default.join((0, __1.getServerRoot)(), 'src', 'plugins', this.path);
    }
    /**
     * Construct the full path to the file of this module.
     * @param name
     * @returns The path.
     */
    filePath(name) {
        return `${this.fullPath}/${name}`;
    }
    /**
     * Collect meta data as a JSON object.
     * @returns Object
     */
    toJSON() {
        return {
            id: this.id,
            code: this.code,
            title: this.title,
            description: this.description,
            icon: this.icon,
            version: this.version,
            releaseDate: this.releaseDate,
            use: this.use,
            type: this.type,
            path: this.path
        };
    }
    /**
     * Get the UI setting description or null if the plugin has no settings.
     */
    getSettings() {
        return null;
    }
    /**
     * Get the UI setting description or null if the plugin has no settings.
     */
    getGlobalSettings() {
        return null;
    }
    /**
     * Do the translation for a string.
     */
    t(str, lang) {
        if (this.catalog) {
            return this.catalog.t(str, lang);
        }
        // Mainly useful for plugin testing: translate using local plugin translations if no catalog available.
        if ((lang in this.languages) && (str in this.languages[lang])) {
            return this.languages[lang][str];
        }
        return str;
    }
    /**
     * Get the settings variable values for this plugin.
     * @param db
     * @param name
     */
    async getSetting(db, name) {
        const setting = await db('settings').select('value').where({ name: `${this.code}.${name}` }).first();
        return setting ? setting.value : undefined;
    }
    /**
     * Create an instance of a plugin class and copy static fields into the instance.
     * @param Class
     * @param path
     * @returns
     */
    static create(Class, path, catalog) {
        const instance = new Class();
        instance.path = path;
        instance.catalog = catalog;
        return instance;
    }
}
exports.BackendPlugin = BackendPlugin;
//# sourceMappingURL=BackendPlugin.js.map