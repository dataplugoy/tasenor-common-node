import { TasenorPlugin, TasenorPluginPackaged, IncompleteTasenorPlugin, PluginCatalog, ServiceResponse } from '@dataplug/tasenor-common';
interface PluginConfig {
    BUILD_PATH?: string;
    DEVELOPMENT_PATH?: string;
    INSTALL_PATH?: string;
    PLUGIN_PATH?: string;
}
declare type ConfigVariable = keyof PluginConfig;
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
 * Construct plugin list from the current `Installed` directory.
 */
declare function scanInstalledPlugins(): TasenorPlugin[];
/**
 * Scan for all UI plugins found from the development directory.
 * @returns A list of plugins.
 */
declare function scanUIPlugins(): IncompleteTasenorPlugin[];
/**
 * Scan for all backend plugins found from the development directory.
 * @returns A list of plugins.
 */
declare function scanBackendPlugins(): IncompleteTasenorPlugin[];
/**
 * Remove all files and directories from build directory.
 */
declare function cleanBuildDir(): Promise<void>;
/**
 * Build a tar package of the plugin from the given directories.
 * @param plugin JSON data of the plugin.
 * @param uiPath Path to the UI part.
 * @param backendPath Path to the backebd part.
 * @returns Tar path.
 */
declare function buildPlugin(plugin: TasenorPlugin, uiPath: string | null, backendPath: string | null): Promise<string>;
/**
 * Publish a plugin to ERP.
 * @param plugin
 * @param tarPath
 * @returns
 */
declare function publishPlugin(plugin: TasenorPluginPackaged, tarPath: any): ServiceResponse;
/**
 * Collection of file system and API related plugin handling functions for fetching, building and scanning.
 */
export declare const plugins: {
    buildPlugin: typeof buildPlugin;
    cleanBuildDir: typeof cleanBuildDir;
    findPluginFromIndex: typeof findPluginFromIndex;
    fetchOfficialPluginList: typeof fetchOfficialPluginList;
    getConfig: typeof getConfig;
    loadPluginIndex: typeof loadPluginIndex;
    publishPlugin: typeof publishPlugin;
    samePlugins: typeof samePlugins;
    scanBackendPlugins: typeof scanBackendPlugins;
    scanInstalledPlugins: typeof scanInstalledPlugins;
    scanUIPlugins: typeof scanUIPlugins;
    setConfig: typeof setConfig;
    sortPlugins: typeof sortPlugins;
};
export {};
