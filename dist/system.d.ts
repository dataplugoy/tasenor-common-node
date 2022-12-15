/**
 * Helper to execute system command as a promise.
 * @param command A command.
 * @param quiet If set, do not output.
 * @returns Srandard output if successfully executed.
 */
export declare function system(command: string, quiet?: boolean): Promise<string>;
/**
 * A system call showing real time output of stdout.
 * @param command
 * @param quiet
 * @returns
 */
export declare function systemPiped(command: string, quiet?: boolean, ignoreError?: boolean): Promise<string | null>;
/**
 * Check if the current environment is not development environment.
 */
export declare function isProduction(): boolean;
/**
 * Check and return the operating environment.
 * @returns
 */
export declare function nodeEnv(): string;
/**
 * Check if the current environment is development environment.
 */
export declare function isDevelopment(): boolean;
/**
 * Set the global server root path.
 */
declare global {
    var _serverRootPath: undefined | string;
}
export declare function setServerRoot(path: string): void;
/**
 * Get the path to the root of the running server.
 * @returns
 */
export declare function getServerRoot(): string;
