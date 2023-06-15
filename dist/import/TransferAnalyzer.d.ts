import { AccountNumber, Asset, AccountAddress, AssetTransfer, AssetTransferReason, AssetType, StockValueData, Transaction, TransactionDescription, TransactionKind, TransactionLine, UIQuery, Tag, ImportSegment, ImportStateText, ProcessConfig, SegmentId, TextFileLine } from '@dataplug/tasenor-common';
import { TransactionImportHandler } from './TransactionImportHandler';
import { TransactionUI } from './TransactionUI';
/**
 * ## Transfer Analysis
 *
 * ### Transfer
 *
 * The structure desribing a single part of a transfer is the following:
 * ```json
 * {
 *   "if": "<optional condition>",
 *   "reason": "<reason>",
 *   "type": "<type>",
 *   "asset": "<asset>",
 *   "amount": "<amount>",
 *   "text": "<optional description>"
 *   "questions": {
 *    },
 *   "data": {
 *      <optional additional data>
 *    }
 * }
 * ```
 * Note that every expression is a string. Value to evaluate to `null` has to be given as a string `"null"`.
 *
 * #### Reason
 *
 * The reason component describes the fundamental general background causing the transaction. For example reason
 * can be `expense` or `income`. Some spesific cases are taken seprately due to their nature, which may need
 * different handling. For example `fee` or `dividend` are special cases of those.
 *
 * For more details {@link AssetTransferReason}.
 *
 * #### Type
 *
 * The type of transfer describes either concrete asset class (`stock`, `currency`, `cryptocurrency`) or sometimes
 * more abstract thing like for example `statement` which represent transfer counterpart in the report.
 *
 * For more details {@link AssetType}.
 *
 * #### Asset
 *
 * Asset is the code for denoting the asset itself like currency code or stock ticker. It is also used for
 * other purposes like code denoting income, expense or tax type.
 *
 * Definition is here {@link Asset}.
 *
 * #### Amount
 *
 * The amount is the number of units of the asset transferred. Typically it is measured in default currency but
 * it could be also other currency or crypto currency. These are converted to the default currency during the
 * processing either by using rates information in the transfer itself or by calling external service to find
 * out the value at the transaction date.
 *
 * Special value `null` can be used to denote amount that must be calculated based on the remainder value of
 * all the other transfer parts added together.
 *
 * #### Text
 *
 * By default the explanation is constructed automatically. If one wants to override the description, then the
 * `text` field can be used.
 *
 * #### Questions
 *
 * Questions defined in setup (See {@link TransactionRules}) can be used in a transfer. When we want to determine
 * some aspect of the transaction by using from the user, we can define additional variables mapping the variable
 * names to the question names. Once the questions are answered, the variables are filled with the answers.
 *
 * For example the following sets the variable `type` based on the selection given
 * ```json
 * "questions": {
 *   "type": "Computer purchase"
 * }
 * ```
 *
 * #### Other Fields
 *
 * In addition it may have some special fields:
 * - `if` When this arbitrary expression is given, it is evaluated and if not `true`, entry is skipped.
 * - `data` This field can have optional informative fields of interest displayed by UI. (See {@link AdditionalTransferInfo}.)
 */
export declare class TransferAnalyzer {
    private handler;
    private config;
    private stocks;
    private state;
    private balances;
    constructor(handler: TransactionImportHandler, config: ProcessConfig, state: ImportStateText<'classified'>);
    get UI(): TransactionUI;
    /**
     * Read the initial balance.
     */
    initialize(time: Date): Promise<void>;
    /**
     * Get the summary of the balances.
     */
    getBalances(): any;
    /**
     * Get a single account balance.
     * @param addr
     */
    getBalance(addr: AccountAddress): any;
    /**
     * Update balance.
     * @param txEntry
     * @param name
     * @returns
     */
    applyBalance(txEntry: TransactionLine): number;
    /**
     * Revert balance.
     * @param txEntry
     * @param name
     * @returns
     */
    revertBalance(txEntry: TransactionLine): number;
    /**
     * Get the value from the system configuration.
     */
    getConfig(name: string, def?: unknown): unknown;
    /**
     * Translate a text.
     * @param text
     * @param language
     * @returns
     */
    getTranslation(text: string): Promise<string>;
    /**
     * Collect lines related to the segment.
     * @param segmentId
     */
    getLines(segmentId: SegmentId): TextFileLine[] | null;
    /**
     * Analyse transfers and collect accounts needed.
     * @param transfers
     * @param options.findMissing If given, list missing accounts by their reason and type instead of throwing error.
     * @returns Accounts or list of missing.
     */
    collectAccounts(segment: ImportSegment, transfers: TransactionDescription, options?: {
        findMissing?: boolean;
    }): Promise<Record<string, AccountNumber> | AccountAddress[]>;
    /**
     * Collect some important values needed from transfer and resolve what kind of transfer we have.
     *
     * The following values are resolved:
     * * `kind` - Kind of transfer recognized.
     * * `exchange` - Name of the imporeter.
     * * `name` - Name of the target asset for statement, if relevant.
     * * `takeAmount` - Amount affecting the asset.
     * * `takeAsset` - The name of the asset.
     */
    collectOtherValues(transfers: TransactionDescription, values: Record<string, string | number>): Promise<Record<string, string | number>>;
    /**
     * Helper to set values in data field.
     * @param transfer
     * @param values
     */
    setData(transfer: any, values: any): void;
    /**
     * Helper to set rate in data field.
     * @param transfer
     * @param asset
     * @param rate
     */
    setRate(transfer: any, asset: any, rate: any): void;
    /**
     * Helper to either get asset rate from data directly or ask from elsewhere.
     * @param time
     * @param transfer
     * @param type
     * @param asset
     */
    getRate(time: Date, transfer: AssetTransfer, type: AssetType, asset: Asset): Promise<number>;
    /**
       * Check if rate needs to be fetched and updates it, if needed. Calculate the value.
       * @param time
       * @param transfer
       * @param type
       * @param asset
       */
    setValue(time: Date, transfer: AssetTransfer, type: AssetType, asset: Asset, amount?: number | null): Promise<void>;
    /**
     * Find local currency entries and valueate them trivially.
     * @param time
     * @param transfers
     */
    fillInLocalCurrencies(time: Date, transfers: TransactionDescription): Promise<void>;
    /**
     * Find currency entries and valueate them.
     * @param time
     * @param transfers
     */
    fillInCurrencies(time: Date, transfers: TransactionDescription): Promise<void>;
    /**
     * Check and fill the last unknown value, if only one left.
     * @param canDeduct - If set to false, just check and do not fill.
     * @returns
     */
    fillLastMissing(transfers: AssetTransfer[], canDeduct: boolean): boolean;
    /**
     * Look for all missing asset values and fill them in as system currency to transfer list and values list.
     *
     * May fill the following values:
     *
     * * `giveAmount` - Amount used the other given away if any.
     * * `giveAsset` - Name of the other asset given away if any.
     * * `takeAmount` - Amount  the other asset received if any.
     * * `takeAsset` - Name of the other asset received if any.
     * * `data.currency` - The original currency used, if different than default.
     * * `data.currencyValue` - Value in original currency used, if different than default.
     *
     * For transfers, the following values may be filled:
     *
     * * `value` - Value in the system default currency.
     * * `rates` - Asset value rates vs. the system currency used in conversion.
     *
     * @param transfers
     * @param values
     * @param segment
     * @param config
     */
    calculateAssetValues(transfers: TransactionDescription, segment: ImportSegment): Promise<Record<string, string | number>>;
    /**
     * Try some heuristics if we can map transfers so that can solve multiple missing valuations.
     * @param transfers
     */
    handleMultipleMissingValues(transfers: TransactionDescription): Promise<void>;
    /**
     * Analyze transfer and construct the corresponding transaction structure.
     * @param transfers
     * @returns
     */
    analyze(transfers: TransactionDescription, segment: ImportSegment, config: ProcessConfig): Promise<TransactionDescription>;
    /**
     * Construct a transaction based on the data collected.
     * @param transfers
     * @param kind
     * @param values
     * @param accounts
     * @param segment
     * @returns
     */
    createTransaction(transfers: TransactionDescription, kind: TransactionKind, values: Record<string, string | number>, accounts: Record<string, AccountNumber>, segment: ImportSegment): Promise<Transaction>;
    /**
     * Handle tags for one transaction line.
     * @param tx
     * @param segment
     * @param config
     */
    postProcessTags(tx: TransactionLine, transfer: AssetTransfer, segment: ImportSegment): Promise<TransactionLine>;
    /**
     * Get the specific account from the settings. Checks also more generic '<reason>.<type>.*' version if the exact not found.
     * @param reason
     * @param type
     * @param asset
     * @returns
     */
    getAccount(reason: AssetTransferReason, type: AssetType, asset: Asset, segmentId?: SegmentId): Promise<undefined | AccountNumber>;
    /**
     * Get tags for the transfer if defined in configuration.
     * @param reason
     * @param type
     * @param asset
     * @returns
     */
    getTags(reason: AssetTransferReason, type: AssetType, asset: Asset): Promise<Tag[] | undefined>;
    /**
     * Similar to getTags() but use account address.
     * @param addr
     */
    getTagsForAddr(addr: AccountAddress): Promise<Tag[] | undefined>;
    /**
     * Get the UI query for account from the settings if defined.
     * @param reason
     * @param type
     * @param asset
     * @returns
     */
    getAccountQuery(reason: AssetTransferReason, type: AssetType, asset: Asset): Promise<undefined | UIQuery>;
    /**
     * Builder for text descriptions.
     * @param template
     * @param values
     */
    constructText(kind: TransactionKind, values: Record<string, unknown>, original: TransactionDescription): Promise<string>;
    /**
     * Find the rate in the default currency for the asset.
     * @param time
     * @param type
     * @param asset
     */
    getRateAt(time: Date, type: AssetType, asset: Asset): Promise<number>;
    /**
     * Find the amount of asset owned at the spesific time.
     * @param time
     * @param type
     * @param asset
     * @returns
     */
    getStock(time: Date, type: AssetType, asset: Asset): Promise<StockValueData>;
    /**
     * Update internal stock bookkeeping.
     * @param time
     * @param type
     * @param asset
     * @param amount
     * @param value
     */
    changeStock(time: Date, type: AssetType, asset: Asset, amount: number, value: number): Promise<void>;
    /**
     * Get the average price of the asset at the specific time.
     * @param time
     * @param type
     * @param asset
     * @returns
     */
    getAverage(time: Date, type: AssetType, asset: Asset): Promise<number>;
    /**
     * Detect currencies and their rates and fill in data where we can.
     * @param transfers
     */
    fillCurrencies(transfers: TransactionDescription): void;
}
