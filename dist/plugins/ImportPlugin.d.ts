import { TransactionImportHandler } from '../import/TransactionImportHandler';
import { BackendPlugin } from './BackendPlugin';
/**
 * A plugin providing import services for one or more file formats.
 */
export declare class ImportPlugin extends BackendPlugin {
    private handler;
    private UI;
    constructor(handler: TransactionImportHandler);
    /**
     * Get common translations for all import plugins.
     * @returns
     */
    getLanguages(): {
        en: {
            'account-debt-currency': string;
            'account-deposit-currency': string;
            'account-deposit-external': string;
            'account-distribution-currency': string;
            'account-distribution-statement': string;
            'account-dividend-currency': string;
            'account-expense-currency': string;
            'account-expense-statement': string;
            'account-fee-currency': string;
            'account-fee-crypto': string;
            'account-forex-currency': string;
            'account-income-currency': string;
            'account-income-statement': string;
            'account-investment-currency': string;
            'account-investment-statement': string;
            'account-tax-currency': string;
            'account-tax-statement': string;
            'account-trade-crypto': string;
            'account-trade-stock': string;
            'account-trade-currency': string;
            'account-transfer-currency': string;
            'account-transfer-external': string;
            'account-withdrawal-currency': string;
            'account-withdrawal-external': string;
            'asset-type-crypto': string;
            'asset-type-currency': string;
            'asset-type-external': string;
            'asset-type-statement': string;
            'asset-type-stock': string;
            'asset-type-short': string;
            'import-text-buy': string;
            'import-text-correction': string;
            'import-text-deposit': string;
            'import-text-distribution': string;
            'import-text-dividend': string;
            'import-text-expense': string;
            'import-text-forex': string;
            'import-text-income': string;
            'import-text-investment': string;
            'import-text-sell': string;
            'import-text-short-buy': string;
            'import-text-short-sell': string;
            'import-text-tax': string;
            'import-text-trade': string;
            'import-text-transfer': string;
            'import-text-withdrawal': string;
            'reason-deposit': string;
            'reason-dividend': string;
            'reason-expense': string;
            'reason-fee': string;
            'reason-forex': string;
            'reason-income': string;
            'reason-trade': string;
            'reason-transfer': string;
            'reason-withdrawal': string;
            'note-split': string;
            'note-converted': string;
            'note-spinoff': string;
            'note-renamed': string;
            'note-old-name': string;
            'note-new-name': string;
            'note-renaming': string;
        };
        fi: {
            'account-debt-currency': string;
            'account-deposit-currency': string;
            'account-deposit-external': string;
            'account-distribution-currency': string;
            'account-distribution-statement': string;
            'account-dividend-currency': string;
            'account-expense-currency': string;
            'account-expense-statement': string;
            'account-fee-currency': string;
            'account-fee-crypto': string;
            'account-forex-currency': string;
            'account-income-currency': string;
            'account-income-statement': string;
            'account-investment-currency': string;
            'account-investment-statement': string;
            'account-tax-currency': string;
            'account-tax-statement': string;
            'account-trade-crypto': string;
            'account-trade-stock': string;
            'account-trade-currency': string;
            'account-transfer-currency': string;
            'account-transfer-external': string;
            'account-withdrawal-currency': string;
            'account-withdrawal-external': string;
            'asset-type-crypto': string;
            'asset-type-currency': string;
            'asset-type-external': string;
            'asset-type-statement': string;
            'asset-type-stock': string;
            'asset-type-short': string;
            'Do you want to import also currency deposits here?': string;
            'Do you want to import also currency withdrawals here?': string;
            'import-text-buy': string;
            'import-text-correction': string;
            'import-text-deposit': string;
            'import-text-distribution': string;
            'import-text-dividend': string;
            'import-text-expense': string;
            'import-text-forex': string;
            'import-text-income': string;
            'import-text-investment': string;
            'import-text-sell': string;
            'import-text-short-buy': string;
            'import-text-short-sell': string;
            'import-text-tax': string;
            'import-text-trade': string;
            'import-text-transfer': string;
            'import-text-withdrawal': string;
            'Parsing error in expression `{expr}`: {message}': string;
            'reason-deposit': string;
            'reason-dividend': string;
            'reason-expense': string;
            'reason-fee': string;
            'reason-forex': string;
            'reason-income': string;
            'reason-trade': string;
            'reason-transfer': string;
            'reason-withdrawal': string;
            'Retried successfully': string;
            'Retry failed': string;
            'Select one of the following:': string;
            'Additional information needed': string;
            'Based on the following imported lines': string;
            'Do you want to use the same account for all of them?': string;
            Created: string;
            Duplicates: string;
            Ignored: string;
            Skipped: string;
            'Account Changes': string;
            'Process Was Successfully Completed!': string;
            'Do we allow short selling of assets?': string;
            January: string;
            February: string;
            March: string;
            April: string;
            May: string;
            June: string;
            July: string;
            August: string;
            September: string;
            October: string;
            November: string;
            December: string;
            'note-split': string;
            'note-converted': string;
            'note-spinoff': string;
            'note-renamed': string;
            'note-old-name': string;
            'note-new-name': string;
            'The account below has negative balance. If you want to record it to the separate debt account, please select another account below:': string;
            'Additional loan taken': string;
            'Loan amortization': string;
            'The date {date} falls outside of the period {firstDate} to {lastDate}.': string;
            'What do we do with that kind of transactions?': string;
            'Ignore transaction': string;
            'Halt with an error': string;
            'Is transaction fee of type {type} already included in the {reason} total?': string;
            'Select contra account for imported transactions, i.e. cash account.': string;
        };
    };
    /**
     * Get instance of internal handler class.
     * @returns
     */
    getHandler(): TransactionImportHandler;
    /**
     * Load and return default rules from the JSON-rules file.
     * @returns
     */
    getRules(): JSON;
}
