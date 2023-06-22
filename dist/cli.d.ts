import FormData from 'form-data';
import { HttpMethod, Url, Value, TokenPair, Token, HttpResponse } from '@dataplug/tasenor-common';
import { Command, CommandArgumentDefault, CommandArguments } from './commands';
/**
 * Ask a question on the console and return answer.
 * @param question
 * @returns
 */
declare function ask(question: string): Promise<string>;
/**
 * Exit hook that needs to be called if used functions in this library.
 */
declare function exit(): void;
/**
 * An interface for accessing API.
 */
export declare class CLIRunner {
    user: string;
    password: string;
    api: Url;
    uiApi: Url;
    token: Token;
    commands: Record<string, Command>;
    originalArgs: string[];
    args: CommandArguments;
    /**
     * Execute HTTP request.
     * @param method
     * @param url
     * @returns
     */
    request(method: HttpMethod, url: string, data: Value | undefined | FormData): Promise<HttpResponse>;
    /**
     * Execute HTTP request against UI API.
     * @param method
     * @param url
     * @returns
     */
    requestUi(method: HttpMethod, url: string, data: Value | undefined | FormData): Promise<HttpResponse>;
    /**
     * Execute request with optional retries.
     * @param caller
     * @param fullUrl
     * @param data
     * @returns
     */
    doRequest(caller: any, fullUrl: any, data: any): Promise<import("@dataplug/tasenor-common").HttpSuccessResponse<Value>>;
    /**
     * Log in if we don't have access token yet.
     */
    login(): Promise<void>;
    /**
     * Set up the API.
     * @param tokens
     */
    configureApi(api: Url, tokens?: TokenPair | undefined): void;
}
/**
 * A class implementing dynamic collection of commands that are automatically looked up when called.
 */
export declare class CLI extends CLIRunner {
    /**
     * Scan commands and instantiate them to the collection.
     * @param paths
     */
    constructor();
    /**
     * Insert defaults for the arguments.
     * @param args
     */
    addDefaults(defaults: CommandArgumentDefault[]): void;
    /**
     * Parse and execute the command.
     */
    run(defaults?: CommandArgumentDefault[], explicitArgs?: string[]): Promise<void>;
}
export declare const cli: {
    ask: typeof ask;
    exit: typeof exit;
};
export {};
