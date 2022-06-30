import { Asset, AssetType, AssetExchange, AccountNumber, TradeableAsset, StockValueData, Currency, AssetTransfer, BalanceBookkeeping } from '@dataplug/tasenor-common';
import { ProcessConnector } from 'interactive-stateful-process';
/**
 * An interface definition for linking generic import processor to the Bookkeeper.
 */
export interface TransactionImportConnector extends ProcessConnector {
    /**
     * Set the balances at the given time stamp.
     * @param time
     * @param balances
     */
    initializeBalances(time: Date, balances: BalanceBookkeeping): Promise<void>;
    /**
     * Get the list of accounts that are canditates for holding matching transactions of the given account address.
     * @param asset
     */
    getAccounts(asset: Asset): Promise<AccountNumber[]>;
    /**
     * Get the preferred default account for the given account address.
     * @param addr
     */
    getRate(time: Date, type: AssetType, asset: Asset, currency: Currency, exchange: AssetExchange): Promise<number>;
    /**
     * Find out how many assets we have at the given time.
     * @param time
     * @param account
     * @param symbol
     */
    getStock(time: Date, account: AccountNumber, symbol: TradeableAsset): Promise<StockValueData>;
    /**
     * Find the VAT value for the transfer if any.
     * @param time
     * @param transfer
     * @param currency
     */
    getVAT(time: Date, transfer: AssetTransfer, currency: Currency): Promise<null | number>;
}
export declare function isTransactionImportConnector(o: unknown): o is TransactionImportConnector;
