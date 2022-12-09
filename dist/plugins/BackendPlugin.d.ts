import { TasenorElement, BackendCatalog, Constructor, DirectoryPath, FilePath, Language, PluginCode, PluginType, PluginUse, Version, ID } from '@dataplug/tasenor-common';
import { KnexDatabase } from '..';
/**
 * Baseclass for all plugins for back-end.
 */
export declare class BackendPlugin {
    id: ID;
    code: PluginCode;
    title: string;
    version: Version | null;
    releaseDate: Date | string | null;
    use: PluginUse | 'unknown';
    type: PluginType | 'unknown';
    icon: string;
    description: string;
    path: string;
    languages: Record<string, Record<string, string>>;
    private catalog?;
    constructor();
    /**
     * Hook to be executed once during installing.
     */
    install(): Promise<void>;
    /**
     * Hook to be executed one during uninstalling.
     */
    uninstall(): Promise<void>;
    /**
     * Hook to be executed once for every database during installing.
     * @param db Knex instance of the database.
     */
    installToDb(db: KnexDatabase): Promise<void>;
    /**
     * Hook to be executed once for every database during uninstalling.
     * @param db Knex instance of the database.
     */
    uninstallFromDb(db: KnexDatabase): Promise<void>;
    /**
     * Get the full path to the directory of this plugin.
     * @returns The path.
     */
    get fullPath(): DirectoryPath;
    /**
     * Construct the full path to the file of this module.
     * @param name
     * @returns The path.
     */
    filePath(name: string): FilePath;
    /**
     * Collect meta data as a JSON object.
     * @returns Object
     */
    toJSON(): Record<string, unknown>;
    /**
     * Get the UI setting description or null if the plugin has no settings.
     */
    getSettings(): TasenorElement | null;
    /**
     * Get the UI setting description or null if the plugin has no settings.
     */
    getGlobalSettings(): TasenorElement | null;
    /**
     * Do the translation for a string.
     */
    t(str: string, lang: Language): string;
    /**
     * Get the settings variable values for this plugin.
     * @param db
     * @param name
     */
    getSetting(db: KnexDatabase, name: string): Promise<any>;
    /**
     * A scheduled function that is ran once an hour. The hour number is in server time.
     */
    hourly(hour: number): Promise<void>;
    /**
     * A scheduled function that is ran once a day during night time on server time.
     */
    nightly(): Promise<void>;
    /**
     * Create an instance of a plugin class and copy static fields into the instance.
     * @param Class
     * @param path
     * @returns
     */
    static create(Class: Constructor<BackendPlugin>, path: FilePath, catalog: BackendCatalog): BackendPlugin;
}
