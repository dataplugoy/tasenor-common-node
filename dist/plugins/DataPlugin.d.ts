import { BackendPlugin } from './BackendPlugin';
/**
 * A plugin providing mainly some kind of possibly frequently updated data source services.
 * Data will be publicly available from API.
 */
export declare class DataPlugin extends BackendPlugin {
    protected sources: string[];
    constructor(...sources: string[]);
    /**
     * Provide the public knowledge this plugin is providing.
     */
    getKnowledge(): Promise<Record<string, unknown>>;
}
