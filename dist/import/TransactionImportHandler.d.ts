import { ImportAction, ImportStateText, TextFileLine, NO_SEGMENT, SegmentId, ProcessConfig, ImportSegment, ImportState } from 'interactive-elements';
import { ProcessFile, TextFileProcessHandler, Directions, Process } from 'interactive-stateful-process';
import { TasenorElement, AccountAddress, Asset, AssetExchange, AssetTransfer, AssetType, Currency, Language, TransactionDescription, AccountNumber } from '@dataplug/tasenor-common';
import { TransactionUI } from './TransactionUI';
import { TransactionRules } from './TransactionRules';
import { TransactionImportOptions } from './TransactionImportOptions';
/**
 * Core functionality for all transaction import handlers.
 */
export declare class TransactionImportHandler extends TextFileProcessHandler<TasenorElement, ImportAction> {
    UI: TransactionUI;
    rules: TransactionRules;
    private analyzer;
    protected importOptions: TransactionImportOptions;
    constructor(name: string);
    /**
     * By default, we don't support multifile.
     * @param file
     * @returns
     */
    canAppend(file: ProcessFile): boolean;
    /**
     * Get a single account balance.
     * @param addr
     */
    getBalance(addr: AccountAddress): number;
    /**
     * Convert numeric fields to number and fill required fields.
     * @param columns
     */
    lineValues(columns: Record<string, string>): Record<string, number | string>;
    /**
     * Get the translation for the text to the currently configured language.
     * @param text
     * @returns
     */
    getTranslation(text: string, language: Language | undefined): Promise<string>;
    /**
     * Get the account having matching asset in their tax description.
     * @param asset
     * @returns
     */
    getAccountCanditates(addr: AccountAddress): Promise<AccountNumber[]>;
    /**
     * Construct grouping for the line data with columns defined using sub class that can generate unique ID per transaction.
     * @param state
     */
    groupingById(state: ImportStateText<'segmented'>): Promise<ImportStateText<'segmented'>>;
    /**
     * Default parser for file data.
     */
    parse(state: ImportStateText<'initial'>, config?: ProcessConfig): Promise<ImportStateText<'segmented'>>;
    /**
     * Default segmentation is parsing CSV and then grouping by segment ID constructed for each line.
     * @param state
     * @param files
     * @returns
     */
    segmentation(process: Process<TasenorElement, ImportState, ImportAction>, state: ImportStateText<'initial'>, files: ProcessFile[]): Promise<ImportStateText<'segmented'>>;
    /**
     * Helper to dump segmentation results.
     */
    debugSegmentation(state: ImportStateText<'segmented'>): void;
    /**
     * Construct a hash for a text line usable as unique segment ID.
     * @param line
     */
    hash(line: TextFileLine): SegmentId;
    /**
     * Segmentation by ID can use this function to group lines by their ID. By default the hash is used.
     * @param line
     */
    segmentId(line: TextFileLine): SegmentId | typeof NO_SEGMENT;
    /**
     * Find out the timestamp from the line data if any.
     * @param line
     */
    time(line: TextFileLine): Date | undefined;
    /**
     * Default classification constructs lines belonging to each segment and asks subclass to classify them.
     *
     * @param state
     * @param files
     * @returns
     */
    classification(process: Process<TasenorElement, ImportState, ImportAction>, state: ImportStateText<'segmented'>, files: ProcessFile[]): Promise<ImportStateText<'classified'>>;
    /**
     * Helper to dump classification results.
     */
    debugClassification(state: ImportStateText<'classified'>): void;
    /**
     * Implementing this function in the subclass the classification can be done segment by segment.
     * @param lines
     */
    classifyLines(lines: TextFileLine[], config: ProcessConfig, segment: ImportSegment): Promise<TransactionDescription>;
    /**
     * Collect lines related to the segment.
     * @param state
     * @param segmentId
     */
    getLines(state: ImportStateText<'classified'>, segmentId: SegmentId): TextFileLine[] | null;
    /**
     * Check if all accounts are configured and if not, construct query UI for it.
     * @param state
     * @returns
     */
    needInputForAnalysis(state: ImportStateText<'classified'>, config: ProcessConfig): Promise<Directions<TasenorElement, ImportAction> | false>;
    /**
     * Study configured accounts and missing accounts and construct appropriate UI query for accounts.
     * @param missing
     * @param config
     * @returns
     */
    directionsForMissingAccounts(missing: Set<AccountAddress>, config: ProcessConfig): Promise<Directions<TasenorElement, ImportAction> | false>;
    /**
     * Convert transfers to the actual transactions with account numbers.
     * @param state
     * @param files
     */
    analysis(process: Process<TasenorElement, ImportState, ImportAction>, state: ImportStateText<'classified'>, files: ProcessFile[], config: ProcessConfig): Promise<ImportStateText<'analyzed'>>;
    /**
     * Analyze and construct transaction details from a transaction description.
     * @param txs
     */
    analyze(txs: TransactionDescription, segment: ImportSegment, config: ProcessConfig, state: ImportStateText<'classified'>): Promise<TransactionDescription>;
    /**
     * Dump analysis results.
     * @param state
     */
    debugAnalysis(state: ImportStateText<'analyzed'>): void;
    /**
     * Apply the result using the connector.
     * @param state
     * @param files
     * @returns
     */
    execution(process: Process<TasenorElement, ImportState, ImportAction>, state: ImportStateText<'analyzed'>, files: ProcessFile[]): Promise<ImportStateText<'executed'>>;
    /**
     * Ask VAT from connector.
     * @param time
     * @param reason
     * @param asset
     * @param currency
     */
    getVAT(time: Date, transfer: AssetTransfer, currency: Currency): Promise<null | number>;
    /**
     * Find the rate in the default currency for the asset.
     * If there is information about rates inside the files, this function could be overridden and
     * used for digging actual values. Those values can be collected during parse() call.
     * @param time
     * @param type
     * @param asset
     */
    getRate(time: Date, type: AssetType, asset: Asset, currency: Currency, exchange: AssetExchange): Promise<number>;
}
