import { Asset, AssetType, AssetExchange, AccountNumber, TradeableAsset, StockValueData, Currency, AssetTransfer, BalanceBookkeeping } from '@dataplug/tasenor-common';
import { ProcessConnector } from 'interactive-stateful-process';
/**
 * An interface definition for linking generic import processor to the Bookkeeper.
 */
export interface TransactionImportConnector extends ProcessConnector {
    initializeBalances(time: Date, balances: BalanceBookkeeping): Promise<void>;
    getAccounts(asset: Asset): Promise<AccountNumber[]>;
    getRate(time: Date, type: AssetType, asset: Asset, currency: Currency, exchange: AssetExchange): Promise<number>;
    getStock(time: Date, account: AccountNumber, symbol: TradeableAsset): Promise<StockValueData>;
    getVAT(time: Date, transfer: AssetTransfer, currency: Currency): Promise<null | number>;
}
export declare function isTransactionImportConnector(o: unknown): o is TransactionImportConnector;
