import { UUID } from '@dataplug/tasenor-common';
/**
 * Utility to create and check hashes from passwords.
 */
export declare class Password {
    /**
     * Create one way hash for a password.
     * @param password A password.
     * @returns
     */
    static hash(password: string): Promise<string>;
    /**
     * Verify that given hash has been created from the given password.
     * @param password
     * @param hash
     * @returns
     */
    static compare(password: string, hash: string): Promise<boolean>;
}
/**
 * Generate a random string of the given length.
 * @param len
 */
export declare function randomString(len?: number): string;
/**
 * Generate UUID.
 * @returns A string.
 */
export declare function createUuid(): UUID;
