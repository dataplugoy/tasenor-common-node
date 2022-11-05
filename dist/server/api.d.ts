import { ProcessModelData, ID, ProcessModelDetailedData, ProcessStepModelData } from '@dataplug/tasenor-common';
import { KnexDatabase } from '../database';
export declare type ProcessApi = {
    process: {
        getAll: () => Promise<ProcessModelData[]>;
        get: (id: ID) => Promise<ProcessModelDetailedData>;
        getStep: (id: ID, step: number) => Promise<ProcessStepModelData>;
    };
};
/**
 * Data query API for processes.
 * @param db
 * @returns
 */
export default function (db: KnexDatabase): ProcessApi;
