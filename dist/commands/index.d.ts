import { AccountModelData, AccountNumber, ImporterModelData, TasenorPlugin, FilePath, PeriodModelData, ShortDate, TagModelData, ID } from '@dataplug/tasenor-common';
import { ArgumentParser } from 'argparse';
import FormData from 'form-data';
export type CommandArgument = string | null | undefined | string[];
/**
 * Argument container type for commands.
 */
export type CommandArguments = Record<string, CommandArgument>;
/**
 * Definition of argument name, corresponding environment variable and default value.
 */
export type CommandArgumentDefault = {
    name: string;
    envName: string;
    defaultValue: string;
};
/**
 * Data for creating entries.
 */
export type CommandEntryData = {
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
    constructor(cli: any);
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
