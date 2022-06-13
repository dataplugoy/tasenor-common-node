import { Hostname } from '@dataplug/tasenor-common';
import { Knex } from 'knex';
export declare type KnexDatabase = Knex<any, any[]>;
export declare type KnexConfig = Record<string, any>;
export declare type KnexConnectionInfo = {
    host: string;
    port: string | number;
    database: string;
    user: string;
    password: string;
};
/**
 * Generate a name for a database that does not yet exist.
 * @param masterDb - Master database.
 * @param init - Initial part of the name.
 * @returns Suitable name.
 */
declare function findName(masterDb: KnexDatabase, init: string): Promise<string>;
/**
 * Terminate all DB connections.
 */
declare function disconnectAll(): Promise<void>;
/**
 * Get a list of all customer database connection infos.
 */
declare function customerDbs(hostOverride?: null | Hostname): Promise<KnexConnectionInfo[]>;
/**
 * Resolve database host from environment DATABASE_URL if set.
 */
declare function envHost(): string | null;
export declare const DB: {
    create: (masterDb: KnexDatabase, name: DatabaseName, host: Hostname, port: number, migrations?: string | null, hostOverride?: null | Hostname) => Promise<any>;
    customerDbs: typeof customerDbs;
    destroy: (masterDb: KnexDatabase, name: DatabaseName, hostOverride?: null | Hostname) => Promise<string | null>;
    disconnectAll: typeof disconnectAll;
    envHost: typeof envHost;
    exists: (master: KnexDatabase, name: DatabaseName) => Promise<boolean>;
    findName: typeof findName;
    get: (master: KnexDatabase, name: DatabaseName, hostOverride?: null | Hostname) => Promise<KnexDatabase>;
    getConfig: (master: KnexDatabase, name: DatabaseName, hostOverride?: null | Hostname) => Promise<KnexConfig>;
    getKnexConfig: (knexUrl: Url) => KnexConfig;
    getMaster: () => KnexDatabase;
    getMasterConfig: () => KnexConfig;
    getRoot: () => KnexDatabase;
    getRootConfig: () => KnexConfig;
    isValidName: (name: string) => boolean;
    migrate: (masterDb: KnexDatabase, name: DatabaseName, migrations: string, hostOverride?: null | Hostname) => Promise<any>;
    rollback: (masterDb: KnexDatabase, name: DatabaseName, migrations: string, hostOverride?: null | Hostname) => Promise<any>;
};
export {};
