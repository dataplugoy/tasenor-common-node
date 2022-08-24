import { ReportOptions, ReportID, ReportFlagName, ReportItem, ReportQueryParams, ReportLine, AccountNumber, ReportColumnDefinition, PeriodModel, ReportFormat } from '@dataplug/tasenor-common';
import { BackendPlugin } from './BackendPlugin';
/**
 * A plugin providing one or more reports.
 */
export declare class ReportPlugin extends BackendPlugin {
    private formats;
    constructor(...formats: ReportID[]);
    /**
     * Read in report struture file.
     */
    getReportStructure(id: any): ReportFormat | undefined;
    /**
     * Gather report format descriptions available, if they have.
     * @returns List of report IDs
     */
    getReportStructures(): {};
    /**
     * Check if the given report is provided by this plugin.
     * @param id
     */
    hasReport(id: any): boolean;
    /**
     * Return UI option definitions for the given report.
     * @param id
     */
    getReportOptions(id: any): ReportOptions;
    /**
     * Convert time stamp or Date to date string YYYY-MM-DD.
     * @param {Number} timestamp
     */
    time2str(timestamp: any): any;
    /**
     * Construct rendering information from report flags
     * @param flags
     * @returns
     */
    flags2item(flags: ReportFlagName[]): ReportItem;
    /**
     * Construct column definitions for the report.
     * @param id
     * @param entries
     * @param options
     */
    getColumns(id: any, entries: any, options: ReportOptions, settings: any): Promise<ReportColumnDefinition[]>;
    /**
     * Construct a title for a column.
     * @param id
     * @param period
     * @param options
     */
    columnTitle(id: ReportID, period: PeriodModel, options: ReportOptions): string;
    /**
     * Force some options, if needed.
     * @returns
     */
    forceOptions(options: any): {
        negateAssetAndProfit: boolean;
        addPreviousPeriod: boolean;
    };
    /**
     * Construct a SQL for the report query.
     * @param db
     * @param options
     * @returns A knex query prepared.
     */
    constructSqlQuery(db: any, options: any, settings: any): Promise<any>;
    /**
     * Construct a report data for the report.
     * @param db
     * @param id
     * @param options
     *
     * The return value has a structure:
     * ```
     * {
     *   format: id,
     *   columns: [
     *     { type, name, title }, { type2, name2, title2 }, ...
     *   ],
     *   meta: {
     *     businessName,
     *     businessId
     *   },
     *   data
     * }
     * ```
     *
     * Resulting entries on data is an array of objects containing:
     * * `tab` Zero originating indentation number.
     * * `error` If true, this row has an error.
     * * `required` If true, this is always shown.
     * * `hideTotal` if true, do not show total.
     * * `bold` if true, show in bold.
     * * `italic` if true, show in italic.
     * * `bigger` if true, show in bigger font.
     * * `fullWidth` if set, the content in column index defined here is expanded to cover all columns.
     * * `useRemainingColumns` if set, extend this column index to use all the rest columns in the row.
     * * `accountDetails` if true, after this are summarized accounts under this entry.
     * * `isAccount` if true, this is an account entry.
     * * `needLocalization` if set, value should be localized, i.e. translated via Localization component in ui.
     * * `name` Title of the entry.
     * * `number` Account number if the entry is an account.
     * * `amounts` An object with entry for each column mapping name of the columnt to the value to display.
     */
    renderReport(db: any, id: any, options?: ReportQueryParams): Promise<any>;
    /**
     * Filter out entries not matching to the report selected parameters.
     * @param id
     * @param entries
     * @param options
     * @param settings
     */
    doFiltering(id: any, entries: any, options: any, settings: any): any;
    /**
     * This function converts the list of relevant entries to the column report data.
     * @param id
     * @param entries
     * @param options
     * @param columns
     */
    preProcess(id: any, entries: any, options: any, settings: any, columns: any): void;
    /**
     * Do post processing for report data before sending it.
     * @param id Report type.
     * @param data Calculated report data
     * @param options Report options.
     * @param settings System settings.
     * @param columns Column definitions.
     * @returns
     */
    postProcess(id: any, data: any, options: any, settings: any, columns: any): any;
    /**
     * A helper to combine final report from pre-processed material for reports using text description.
     * @param accountNumbers A set of all account numbers found.
     * @param accountNames A mapping from account numbers to their names.
     * @param columnNames A list of column names.
     * @param format A text description of the report.
     * @param totals A mapping from account numbers their total balance.
     * @returns
     */
    parseAndCombineReport(accountNumbers: AccountNumber[], accountNames: any, columnNames: any, format: any, totals: any): ReportLine[];
}
