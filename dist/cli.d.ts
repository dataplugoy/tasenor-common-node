import FormData from 'form-data';
import { ArgumentParser } from 'argparse';
import { DirectoryPath, HttpMethod, ServiceResponse, Url, Value, TokenPair, Token, FilePath, PeriodModelData, AccountNumber, AccountModelData, ShortDate, TasenorPlugin, ImporterModelData, TagModelData } from '@dataplug/tasenor-common';
import { ID } from 'interactive-elements';
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
export declare type CommandArgument = string | null | undefined | string[];
/**
 * Argument container type for commands.
 */
export declare type CommandArguments = Record<string, CommandArgument>;
/**
 * Definition of argument name, corresponding environment variable and default value.
 */
export declare type CommandArgumentDefault = {
    name: string;
    envName: string;
    defaultValue: string;
};
/**
 * Data for creating entries.
 */
export declare type CommandEntryData = {
    account_id: ID;
    number?: AccountNumber;
    amount: number;
    description: string;
};
/**
 * A command implementation base class.
 */
export declare class Command {
    protected cli: any;
    protected accounts: Record<AccountNumber, AccountModelData>;
    protected accountsById: Record<number, AccountModelData>;
    protected plugins: TasenorPlugin[];
    protected importers: ImporterModelData[];
    protected args: CommandArguments;
    constructor(cli: CLI);
    get verbose(): boolean;
    get debug(): boolean;
    /**
     * Add command specific arguments.
     * @param parser
     */
    addArguments(parser: ArgumentParser): void;
    /**
     * Set command arguments.
     * @param args
     */
    setArgs(args: CommandArguments): void;
    /**
     * Default output.
     * @param data
     */
    print(data: any): void;
    /**
     * Print out data structure according to the selected options.
     * @param data
     */
    out(prefix: any, data: any): void;
    /**
     * Entry point for running the command.
     * @param args
     */
    run(): Promise<void>;
    /**
     * Construct a form data instance for a file.
     * @param filePath
     * @returns
     */
    formForFile(filePath: FilePath): FormData;
    /**
     * Call the GET API.
     * @param api
     */
    get<T>(api: string): Promise<T>;
    /**
     * Call the GET UI API.
     * @param api
     */
    getUi<T>(api: string): Promise<T>;
    /**
     * Call the DELETE API.
     * @param api
     */
    delete<T>(api: string): Promise<T>;
    /**
     * Call the DELETE API.
     * @param api
     */
    deleteUi<T>(api: string, args?: Record<string, any> | undefined): Promise<T>;
    /**
     * Call the PATCH API.
     * @param api
     */
    patch<T>(api: string, data: FormData | Record<string, any>): Promise<T>;
    /**
     * Call the POST API.
     * @param api
     */
    post<T>(api: string, data: FormData | Record<string, any>): Promise<T>;
    /**
     * Call the POST UI API.
     * @param api
     */
    postUi<T>(api: string, data: FormData | Record<string, any>): Promise<T>;
    /**
     * An alternative POST call to upload file, when its path is known.
     * @param api
     * @param filePath
     * @returns
     */
    postUpload<T>(api: string, filePath: FilePath): Promise<T>;
    /**
     * Execute member function based on the given argument.
     */
    runBy(op: string): Promise<void>;
    /**
     * Ensure string argument.
     * @param arg
     */
    str(arg: CommandArgument): string;
    /**
     * Ensure numeric argument.
     * @param arg
     */
    num(arg: CommandArgument): number;
    /**
     * Convert year, date or number to period ID.
     * @param arg
     */
    periodId(db: CommandArgument, periodArg: CommandArgument): Promise<ID>;
    /**
     * Ensure that there is only one period in the DB and return its ID.
     * @param dbArg
     * @returns
     */
    singlePeriod(dbArg: CommandArgument): Promise<PeriodModelData>;
    /**
     * Read in accounts if not yet read.
     */
    readAccounts(dbArg: CommandArgument): Promise<void>;
    /**
     * Verify that the given number is valid account and return its ID.
     * @param dbArg
     * @param accountArg
     */
    accountId(dbArg: CommandArgument, accountArg: CommandArgument): Promise<ID>;
    /**
     * Verify that argument is one or more entry descriptions.
     * @param entryArg
     */
    entries(dbArg: CommandArgument, entryArg: CommandArgument): Promise<CommandEntryData[]>;
    /**
     * Verify that the argument is proper date.
     * @param date
     */
    date(dateArg: CommandArgument): ShortDate;
    /**
     * Heuristically parse string to JSON value or string if not parseable.
     * @param value
     */
    value(value: CommandArgument): unknown;
    /**
     * Parse either direct JSON data argument or read in file, if string starts with `@`.
     * @param data
     */
    jsonData(dataArg: CommandArgument): Promise<Record<string, unknown>>;
    /**
     * Read in plugin data if not yet read and return info about the plugin.
     * @param pluginArg
     */
    plugin(pluginArg: CommandArgument): Promise<TasenorPlugin | TasenorPlugin[]>;
    /**
     * Get the importer.
     * @param nameArg
     */
    importer(dbArg: CommandArgument, nameArg: CommandArgument): Promise<ImporterModelData>;
    /**
     * Find the named tag or throw an error.
     * @param name
     */
    tag(db: CommandArgument, name: CommandArgument): Promise<TagModelData>;
    /**
     * Show help.
     */
    help(): void;
}
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
     * Scan commands and instantiate them to the collection.
     * @param paths
     */
    constructor(...paths: DirectoryPath[]);
    /**
     * Execute HTTP request.
     * @param method
     * @param url
     * @returns
     */
    request(method: HttpMethod, url: string, data: Value | undefined | FormData): Promise<ServiceResponse>;
    /**
     * Execute HTTP request against UI API.
     * @param method
     * @param url
     * @returns
     */
    requestUi(method: HttpMethod, url: string, data: Value | undefined | FormData): Promise<ServiceResponse>;
    doRequest(caller: any, fullUrl: any, data: any): Promise<import("@dataplug/tasenor-common").HttpSuccessResponse>;
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
