import { PluginService, PluginServiceResponse } from '@dataplug/tasenor-common';
import { BackendPlugin } from './BackendPlugin';
import { KnexDatabase } from '..';
export declare type ServicePluginRequestOptions = {
    rateLimitDelay?: number;
};
/**
 * An API end point provider.
 */
export declare class ServicePlugin extends BackendPlugin {
    private services;
    constructor(...services: any[]);
    getServices(): PluginService[];
    /**
     * A query executor called by the back end for API request.
     * @param best The currently best solution found.
     * @param db Knex database.
     * @param service Name of the service to called.
     * @param query Query parameters.
     * This calls the actual query function, handles errors and finally modifies `best` if found a solution.
     */
    executeQuery(best: unknown, db: KnexDatabase, service: PluginService, query: Record<string, unknown>): Promise<void>;
    /**
     * Perform the actual query.
     *
     * @param db Knex database.
     * @param service Name of the service to called.
     * @param query Query parameters.
     */
    query(db: KnexDatabase, settings: Record<string, unknown>, service: PluginService, query: unknown): Promise<void>;
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
    addResult(old: any, latest: any): void;
    /**
     * Check if the current solution is sufficient.
     * By default, any status 2xx is sufficient.
     */
    isAdequate(solution: any): boolean;
    /**
     * Execute query to the third party service,
     * @param service
     * @param method
     * @param url
     * @param params
     * @returns Result body.
     */
    request(service: any, method: any, url: any, params: any, headers?: {}): Promise<PluginServiceResponse>;
    /**
     * Pick meaningful keys unique from the headers for using as a key, whe storing result to teh cache.
     * @param service
     * @param header
     * By default, no header is used as cache key.
     */
    cacheHeadersKey(service: any, header: any): {};
    /**
     * Pick meaningful keys unique from the query parameters for using as a key, whe storing result to teh cache.
     * @param service
     * @param params
     * By default, all parameters are used as cache key.
     */
    cacheParamsKey(service: any, params: any): any;
    /**
     * Execute query to the third party service,
     * @param db
     * @param service
     * @param method
     * @param url
     * @param params
     * @returns Result body.
     */
    cachedRequest(db: KnexDatabase | null, service: any, method: any, url: any, params: any, headers?: {}, options?: ServicePluginRequestOptions): Promise<any>;
}
