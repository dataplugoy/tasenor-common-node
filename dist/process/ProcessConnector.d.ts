import { ID } from '@dataplug/tasenor-common';
/**
 * A connector interface for querying information, applying results and running various hooks.
 */
export interface ProcessConnector {
    initialize(server: unknown): Promise<void>;
    getTranslation(text: string, language: string): Promise<string>;
    resultExists(processId: ID, args: unknown): Promise<boolean>;
    applyResult(processId: ID, args: unknown): Promise<Record<string, unknown>>;
    rollback(processId: ID): Promise<boolean>;
    success(state: unknown): Promise<void>;
    waiting(state: unknown, directions: any): Promise<void>;
    fail(state: unknown): Promise<void>;
}
export declare const defaultConnector: {
    initialize(): Promise<void>;
    resultExists(processId: ID, args: unknown): Promise<boolean>;
    applyResult(): Promise<Record<string, unknown>>;
    success(): Promise<void>;
    waiting(): Promise<void>;
    fail(): Promise<void>;
    getTranslation(text: string): Promise<string>;
    rollback(processId: ID): Promise<boolean>;
};
