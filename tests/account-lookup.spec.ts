import { AccountAddress, AssetCode, Currency, ExpenseSink, IncomeSource, PluginCode } from '@dataplug/tasenor-common'

export interface AccountLookupCondition {
  tax: AssetCode | ExpenseSink | IncomeSource
  currency?: Currency
  plugin?: PluginCode
}

export interface AccountLookupOption {
  defaultCurrency: Currency,
  plugin: PluginCode
}

export function conditions(addr: AccountAddress): AccountLookupCondition | null {
  const [reason, type, asset] = addr.split('.')

  if (reason === 'debt') {
    if (type === 'currency') {
      return { tax: 'OTHER_CREDITORS', currency: asset as Currency }
    }
  }

  if (reason === 'deposit') {
    if (type === 'currency') {
      return { tax: 'CASH', currency: asset as Currency }
    }
    if (type === 'external') {
      return null
    }
  }
  throw new Error(`No SQL conversion known for account address ${addr}.`)
}

function address2sql(addr: AccountAddress, options: AccountLookupOption): string | null {
  const cond = conditions(addr)
  if (cond === null) {
    return null
  }
  if (cond.currency === options.defaultCurrency) {
    delete cond.currency
  }
  cond.plugin = options.plugin
  const sql = Object.keys(cond).map(key => `(data->>'${key}' = '${cond[key]}')`)
  return sql.join(' AND ')
}

test('Convert account address to account default', async () => {
  const addr2sql = (addr: string, options: Record<string, string>) => address2sql(addr as AccountAddress, {
    defaultCurrency: 'EUR',
    plugin: 'SomeImport' as PluginCode,
    ...options
  })

  expect(addr2sql('debt.currency.EUR', {})).toBe(
    "(data->>'tax' = 'OTHER_CREDITORS') AND (data->>'plugin' = 'SomeImport')"
  )
  expect(addr2sql('debt.currency.SEK', {})).toBe(
    "(data->>'tax' = 'OTHER_CREDITORS') AND (data->>'currency' = 'SEK') AND (data->>'plugin' = 'SomeImport')"
  )
  expect(addr2sql('debt.currency.USD', {})).toBe(
    "(data->>'tax' = 'OTHER_CREDITORS') AND (data->>'currency' = 'USD') AND (data->>'plugin' = 'SomeImport')"
  )
  expect(addr2sql('deposit.currency.EUR', {})).toBe(
    "(data->>'tax' = 'CASH') AND (data->>'plugin' = 'SomeImport')"
  )
  expect(addr2sql('deposit.external.EUR', {})).toBe(
    null
  )
  /*
  expect(addr2sql('distribution.currency.EUR', {})).toBe(
    ''
  )
  expect(addr2sql('distribution.statement.LISTED_DIVIDEND', {})).toBe(
    ''
  )
  expect(addr2sql('dividend.currency.EUR', {})).toBe(
    ''
  )
  expect(addr2sql('dividend.currency.SEK', {})).toBe(
    ''
  )
  expect(addr2sql('dividend.currency.USD', {})).toBe(
    ''
  )
  expect(addr2sql('expense.currency.EUR', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.ADMIN', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.BANKING_FEE', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.EQUIPMENT', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.FURNITURE', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.HARDWARE', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.INFORMATION', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.INTEREST_EXPENSE', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.INTERNET', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.MEETINGS', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.NEEDS_MANUAL_INSPECTION', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.PHONE', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.POSTAGE', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.SOFTWARE', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.STOCK_BROKER_SERVICE_FEE', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.STOCK_BROKER_SERVICE_FEE', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.TICKET', {})).toBe(
    ''
  )
  expect(addr2sql('expense.statement.TRADE_LOSS_STOCK', {})).toBe(
    ''
  )
  expect(addr2sql('fee.currency.EUR', {})).toBe(
    ''
  )
  expect(addr2sql('forex.currency.EUR', {})).toBe(
    ''
  )
  expect(addr2sql('forex.currency.SEK', {})).toBe(
    ''
  )
  expect(addr2sql('forex.currency.USD', {})).toBe(
    ''
  )
  expect(addr2sql('income.currency.EUR', {})).toBe(
    ''
  )
  expect(addr2sql('income.statement.FINLAND_SALES', {})).toBe(
    ''
  )
  expect(addr2sql('income.statement.FINLAND_SALES2', {})).toBe(
    ''
  )
  expect(addr2sql('income.statement.LISTED_DIVIDEND', {})).toBe(
    ''
  )
  expect(addr2sql('income.statement.TRADE_PROFIT_STOCK', {})).toBe(
    ''
  )
  expect(addr2sql('investment.currency.EUR', {})).toBe(
    ''
  )
  expect(addr2sql('investment.statement.NREQ', {})).toBe(
    ''
  )
  expect(addr2sql('loss.currency.*', {})).toBe(
    ''
  )
  expect(addr2sql('profit.currency.*', {})).toBe(
    ''
  )
  expect(addr2sql('tax.currency.EUR', {})).toBe(
    ''
  )
  expect(addr2sql('tax.currency.WITHHOLDING_TAX', {})).toBe(
    ''
  )
  expect(addr2sql('tax.statement.CORPORATE_TAX', {})).toBe(
    ''
  )
  expect(addr2sql('tax.statement.NEEDS_MANUAL_INSPECTION', {})).toBe(
    ''
  )
  expect(addr2sql('tax.statement.PENALTY_OF_DELAY', {})).toBe(
    ''
  )
  expect(addr2sql('tax.statement.TAX_AT_SOURCE', {})).toBe(
    ''
  )
  expect(addr2sql('tax.statement.VAT_DELAYED_PAYABLE', {})).toBe(
    ''
  )
  expect(addr2sql('tax.statement.VAT_FROM_PURCHASES', {})).toBe(
    ''
  )
  expect(addr2sql('tax.statement.VAT_FROM_SALES', {})).toBe(
    ''
  )
  expect(addr2sql('tax.statement.VAT_RECEIVABLE', {})).toBe(
    ''
  )
  expect(addr2sql('tax.statement.WITHHOLDING_TAX', {})).toBe(
    ''
  )
  expect(addr2sql('trade.currency.EUR', {})).toBe(
    ''
  )
  expect(addr2sql('trade.currency.USD', {})).toBe(
    ''
  )
  expect(addr2sql('trade.stock.*', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.currency.EUR', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.Bulkestate', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.Coinbase', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.Crowdestate', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.Fellow', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.Fundu', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.Kraken', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.Lainaaja', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.Lynx', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.Mintos', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.NEEDS_MANUAL_INSPECTION', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.PayPal', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.PeerBerry', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.Robocash', {})).toBe(
    ''
  )
  expect(addr2sql('withdrawal.currency.EUR', {})).toBe(
    ''
  )
  expect(addr2sql('withdrawal.external.EUR', {})).toBe(
    ''
  )
  */
})
