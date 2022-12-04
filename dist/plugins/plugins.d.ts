import { TasenorPlugin, IncompleteTasenorPlugin, PluginCatalog } from '@dataplug/tasenor-common';
interface PluginConfig {
    PLUGIN_PATH?: string;
}
declare type ConfigVariable = keyof PluginConfig;
interface PluginState {
    installed: boolean;
}
/**
 * Get the configuration variable or throw an error.
 * @param variable Name of the variable.
 */
declare function getConfig(variable: ConfigVariable): string;
/**
 * Set the configuration variable. When setting the root for plugins other directories are set automatically.
 * @param variable Name of the variable.
 * @param value Value of the variable.
 */
declare function setConfig(variable: ConfigVariable, value: string): void;
/**
 * Sort list of plugins according to the code.
 * @param plugins A list of plugins.
 * @returns New sorted list.
 */
declare function sortPlugins(plugins: TasenorPlugin[]): TasenorPlugin[];
/**
 * Compare two plugin lists if they are essentially the same.
 * @param listA
 * @param listB
 * @returns True if code, versions and path match.
 */
declare function samePlugins(listA: TasenorPlugin[], listB: TasenorPlugin[]): boolean;
/**
 * Read in the current `index.json` file.
 */
declare function loadPluginIndex(): PluginCatalog;
/**
 * Store plugin index.
 * @param plugins
 */
export declare function savePluginIndex(plugins: any): void;
/**
 * Find the named plugin from the current `index.json` file.
 * @param {String} code
 * @returns Data or null if not found.
 */
declare function findPluginFromIndex(code: string): TasenorPlugin | null;
/**
 * Get the current plugin list maintained by ERP.
 * @returns The latest list.
 */
declare function fetchOfficialPluginList(): Promise<TasenorPlugin[]>;
/**
 * Scan all plugins from the plugin directory based on index files found.
 */
declare function scanPlugins(): IncompleteTasenorPlugin[];
/**
 * Read the local plugin state.
 */
declare function loadPluginState(plugin: IncompleteTasenorPlugin): PluginState;
/**
 * Save local plugin state.
 */
declare function savePluginState(plugin: IncompleteTasenorPlugin, state: PluginState): void;
/**
 * Check if plugin is marked as installed.
 */
declare function isInstalled(plugin: IncompleteTasenorPlugin): boolean;
/**
 * Combine official and installed plugins to the same list and save if changed.
 */
export declare function updatePluginList(): Promise<TasenorPlugin[]>;
/**
 * Collection of file system and API related plugin handling functions for fetching, building and scanning.
 */
export declare const plugins: {
    findPluginFromIndex: typeof findPluginFromIndex;
    fetchOfficialPluginList: typeof fetchOfficialPluginList;
    getConfig: typeof getConfig;
    isInstalled: typeof isInstalled;
    loadPluginIndex: typeof loadPluginIndex;
    loadPluginState: typeof loadPluginState;
    samePlugins: typeof samePlugins;
    savePluginIndex: typeof savePluginIndex;
    savePluginState: typeof savePluginState;
    scanPlugins: typeof scanPlugins;
    setConfig: typeof setConfig;
    sortPlugins: typeof sortPlugins;
    updatePluginList: typeof updatePluginList;
};
export {};
