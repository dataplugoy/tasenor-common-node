import { Secret } from '@dataplug/tasenor-common';
export declare const ALLOWED_VAULT_VARIABLES: string[];
export type VaultVariable = typeof ALLOWED_VAULT_VARIABLES[number];
export type VaultValue = string;
/**
 * Base class for a secret vault implementations.
 */
export declare class Vault {
    url: string;
    values: {
        [key: string]: VaultValue;
    };
    initialized: boolean;
    secret: Secret | null;
    constructor(url: string);
    /**
     * Retrieve all secret values.
     */
    initialize(): Promise<void>;
    /**
     * Get a secret value.
     * @param variable
     * @returns
     */
    get(variable: VaultVariable): VaultValue;
    /**
     * Get the internally generated secret and generate new if none yet generated.
     */
    getPrivateSecret(): Secret;
    /**
     * Set the internal secret (use only in developement).
     */
    setPrivateSecret(secret: Secret): void;
}
/**
 * A secret vault using environment variables only.
 */
export declare class EnvironmentVault extends Vault {
    initialize(): Promise<void>;
}
export declare function getVault(): Vault;
/**
 * Retrieve a value from the vault.
 * @param variable
 * @returns
 */
declare function get(variable: VaultVariable): VaultValue;
/**
 * Get the internally generated secret and generate new if none yet generated.
 */
declare function getPrivateSecret(): Secret;
/**
 * Set the internal secret.
 */
declare function setPrivateSecret(secret: Secret): void;
/**
 * Set up the vault.
 */
declare function initialize(): Promise<void>;
export declare const vault: {
    get: typeof get;
    getPrivateSecret: typeof getPrivateSecret;
    getVault: typeof getVault;
    initialize: typeof initialize;
    setPrivateSecret: typeof setPrivateSecret;
};
export {};
