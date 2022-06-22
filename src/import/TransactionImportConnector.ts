import { Asset, AssetType, AssetExchange, AccountNumber, TradeableAsset, StockValueData, Currency, AssetTransfer, BalanceBookkeeping, AccountAddress } from '@dataplug/tasenor-common'
import { ProcessConnector } from 'interactive-stateful-process'

/**
 * An interface definition for linking generic import processor to the Bookkeeper.
 */
export interface TransactionImportConnector extends ProcessConnector {
  initializeBalances(time: Date, balances: BalanceBookkeeping): Promise<void>
  getAccounts(asset: Asset): Promise<AccountNumber[]>
  getAccountDefault(addr: AccountAddress): Promise<AccountNumber | null>
  getRate(time: Date, type: AssetType, asset: Asset, currency: Currency, exchange: AssetExchange): Promise<number>
  getStock(time: Date, account: AccountNumber, symbol: TradeableAsset): Promise<StockValueData>
  getVAT(time: Date, transfer: AssetTransfer, currency: Currency): Promise<null | number>
}

export function isTransactionImportConnector(o: unknown): o is TransactionImportConnector {
  if (typeof o !== 'object' || o === null) {
    return false
  }
  let f = (o as Record<string, unknown>).getRate
  if (typeof f !== 'function') {
    return false
  }
  f = (o as Record<string, unknown>).getStock
  if (typeof f !== 'function') {
    return false
  }
  f = (o as Record<string, unknown>).initializeBalances
  if (typeof f !== 'function') {
    return false
  }
  f = (o as Record<string, unknown>).getAccounts
  if (typeof f !== 'function') {
    return false
  }
  f = (o as Record<string, unknown>).getVAT
  if (typeof f !== 'function') {
    return false
  }
  f = (o as Record<string, unknown>).getAccountDefault
  if (typeof f !== 'function') {
    return false
  }
  return true
}
