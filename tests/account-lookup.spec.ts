import { AccountAddress, AccountType, Asset, AssetCode, Currency, ExpenseSink, IncomeSource, PluginCode, TaxType, warning } from '@dataplug/tasenor-common'

export interface AccountLookupCondition {
  tax: Asset | TaxType | AssetCode
  currency?: Currency
  plugin?: PluginCode
  type?: AccountType | AccountType[]
}

export interface AccountLookupOption {
  defaultCurrency: Currency,
  plugin: PluginCode,
  strict?: boolean
}

export function conditions(addr: AccountAddress, options: AccountLookupOption): AccountLookupCondition | null {
  const [reason, type, asset] = addr.split('.')

  if (reason === 'debt') {
    if (type === 'currency') {
      // TODO: Or more general creditor instead?
      return { tax: 'OTHER_CREDITORS', currency: asset as Currency, plugin: options.plugin }
    }
  }

  if (reason === 'deposit') {
    if (type === 'currency') {
      return { tax: 'CASH', currency: asset as Currency, plugin: options.plugin }
    }
    if (type === 'external') {
      return null
    }
  }

  if (reason === 'distribution') {
    return null
  }

  if (reason === 'dividend') {
    if (type === 'currency') {
      // TODO: How to handle different sub-types of dividend?
      // Maybe we return options from tightest to more general. Then use first match.
      // Or even directly resolve parenthoods here and return list of SQL in order of preference.
      // If more than one match. show them as first in account dropdown.
      return { tax: 'DIVIDEND', currency: asset as Currency, plugin: options.plugin }
    }
  }

  if (reason === 'expense') {
    if (type === 'currency') {
      // TODO: Is there any change that we could handle this?
      return null
    }
    if (type === 'statement') {
      return { type: AccountType.EXPENSE, tax: asset as ExpenseSink, plugin: options.plugin }
    }
  }

  if (reason === 'fee') {
    if (type === 'currency') {
      return null
    }
  }

  if (reason === 'forex') {
    if (type === 'currency') {
      return { tax: 'CASH', currency: asset as Currency, plugin: options.plugin }
    }
  }

  if (reason === 'income') {
    if (type === 'currency') {
      // TODO: Is there any change that we could handle this?
      return null
    }
    if (type === 'statement') {
      return { type: AccountType.REVENUE, tax: asset as IncomeSource, plugin: options.plugin }
    }
  }

  if (reason === 'investment') {
    if (type === 'currency') {
      return null
    }
    if (type === 'statement') {
      return { type: AccountType.EQUITY, tax: asset as Currency, plugin: options.plugin }
    }
  }

  if (reason === 'tax') {
    if (type === 'currency') {
      return null
    }
    if (type === 'statement') {
      return { type: [AccountType.LIABILITY, AccountType.ASSET], tax: asset as TaxType }
    }
  }

  if (reason === 'trade') {
    if (type === 'currency') {
      return { type: AccountType.ASSET, tax: 'CASH', currency: asset as Currency, plugin: options.plugin }
    }
    if (type === 'stock') {
      return { type: AccountType.ASSET, tax: 'CURRENT_PUBLIC_STOCK_SHARES', currency: asset as Currency, plugin: options.plugin }
    }
    if (type === 'crypto') {
      return { type: AccountType.ASSET, tax: 'CURRENT_CRYPTOCURRENCIES', currency: asset as Currency, plugin: options.plugin }
    }
  }

  const message = `No SQL conversion known for account address '${addr}'.`
  if (options.strict) {
    throw new Error(message)
  }
  warning(message)
  return null
}

function address2sql(addr: AccountAddress, options: AccountLookupOption): string | null {
  const cond = conditions(addr, options)
  if (cond === null) {
    return null
  }

  const addSql: string[] = []
  if (cond.currency === options.defaultCurrency) {
    addSql.push(`(data->>'currency' = '${cond.currency}' OR data->>'currency' IS NULL)`)
    delete cond.currency
  }

  if (cond.type) {
    if (typeof cond.type === 'string') {
      addSql.push(`(type = '${cond.type}')`)
    } else {
      addSql.push('(' + cond.type.map(t => `type = '${t}'`).join(' OR ') + ')')
    }
    delete cond.type
  }

  const sql = Object.keys(cond).map(key => `(data->>'${key}' = '${cond[key]}')`)

  return [...sql, ...addSql].join(' AND ')
}

test('Convert account address to account default', async () => {
  const addr2sql = (addr: string, options: Record<string, string>) => address2sql(addr as AccountAddress, {
    defaultCurrency: 'EUR',
    plugin: 'SomeImport' as PluginCode,
    strict: true,
    ...options
  })

  expect(addr2sql('debt.currency.EUR', {})).toBe(
    "(data->>'tax' = 'OTHER_CREDITORS') AND (data->>'plugin' = 'SomeImport') AND (data->>'currency' = 'EUR' OR data->>'currency' IS NULL)"
  )
  expect(addr2sql('debt.currency.SEK', {})).toBe(
    "(data->>'tax' = 'OTHER_CREDITORS') AND (data->>'currency' = 'SEK') AND (data->>'plugin' = 'SomeImport')"
  )
  expect(addr2sql('debt.currency.USD', {})).toBe(
    "(data->>'tax' = 'OTHER_CREDITORS') AND (data->>'currency' = 'USD') AND (data->>'plugin' = 'SomeImport')"
  )
  expect(addr2sql('deposit.currency.EUR', {})).toBe(
    "(data->>'tax' = 'CASH') AND (data->>'plugin' = 'SomeImport') AND (data->>'currency' = 'EUR' OR data->>'currency' IS NULL)"
  )
  expect(addr2sql('deposit.external.EUR', {})).toBe(
    null
  )
  expect(addr2sql('distribution.currency.EUR', {})).toBe(
    null
  )
  expect(addr2sql('distribution.statement.LISTED_DIVIDEND', {})).toBe(
    null
  )
  expect(addr2sql('dividend.currency.EUR', {})).toBe(
    "(data->>'tax' = 'DIVIDEND') AND (data->>'plugin' = 'SomeImport') AND (data->>'currency' = 'EUR' OR data->>'currency' IS NULL)"
  )
  expect(addr2sql('dividend.currency.SEK', {})).toBe(
    "(data->>'tax' = 'DIVIDEND') AND (data->>'currency' = 'SEK') AND (data->>'plugin' = 'SomeImport')"
  )
  expect(addr2sql('dividend.currency.USD', {})).toBe(
    "(data->>'tax' = 'DIVIDEND') AND (data->>'currency' = 'USD') AND (data->>'plugin' = 'SomeImport')"
  )
  expect(addr2sql('expense.currency.EUR', {})).toBe(
    null
  )
  expect(addr2sql('expense.statement.ADMIN', {})).toBe(
    "(data->>'tax' = 'ADMIN') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('expense.statement.BANKING_FEE', {})).toBe(
    "(data->>'tax' = 'BANKING_FEE') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('expense.statement.EQUIPMENT', {})).toBe(
    "(data->>'tax' = 'EQUIPMENT') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('expense.statement.FURNITURE', {})).toBe(
    "(data->>'tax' = 'FURNITURE') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('expense.statement.HARDWARE', {})).toBe(
    "(data->>'tax' = 'HARDWARE') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('expense.statement.INFORMATION', {})).toBe(
    "(data->>'tax' = 'INFORMATION') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('expense.statement.INTEREST_EXPENSE', {})).toBe(
    "(data->>'tax' = 'INTEREST_EXPENSE') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('expense.statement.INTERNET', {})).toBe(
    "(data->>'tax' = 'INTERNET') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('expense.statement.MEETINGS', {})).toBe(
    "(data->>'tax' = 'MEETINGS') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('expense.statement.NEEDS_MANUAL_INSPECTION', {})).toBe(
    "(data->>'tax' = 'NEEDS_MANUAL_INSPECTION') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('expense.statement.PHONE', {})).toBe(
    "(data->>'tax' = 'PHONE') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('expense.statement.POSTAGE', {})).toBe(
    "(data->>'tax' = 'POSTAGE') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('expense.statement.SOFTWARE', {})).toBe(
    "(data->>'tax' = 'SOFTWARE') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('expense.statement.STOCK_BROKER_SERVICE_FEE', {})).toBe(
    "(data->>'tax' = 'STOCK_BROKER_SERVICE_FEE') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('expense.statement.TICKET', {})).toBe(
    "(data->>'tax' = 'TICKET') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('expense.statement.TRADE_LOSS_STOCK', {})).toBe(
    "(data->>'tax' = 'TRADE_LOSS_STOCK') AND (data->>'plugin' = 'SomeImport') AND (type = 'EXPENSE')"
  )
  expect(addr2sql('fee.currency.EUR', {})).toBe(
    null
  )
  expect(addr2sql('forex.currency.EUR', {})).toBe(
    "(data->>'tax' = 'CASH') AND (data->>'plugin' = 'SomeImport') AND (data->>'currency' = 'EUR' OR data->>'currency' IS NULL)"
  )
  expect(addr2sql('forex.currency.SEK', {})).toBe(
    "(data->>'tax' = 'CASH') AND (data->>'currency' = 'SEK') AND (data->>'plugin' = 'SomeImport')"
  )
  expect(addr2sql('forex.currency.USD', {})).toBe(
    "(data->>'tax' = 'CASH') AND (data->>'currency' = 'USD') AND (data->>'plugin' = 'SomeImport')"
  )
  expect(addr2sql('income.currency.EUR', {})).toBe(
    null
  )
  expect(addr2sql('income.statement.FINLAND_SALES', {})).toBe(
    "(data->>'tax' = 'FINLAND_SALES') AND (data->>'plugin' = 'SomeImport') AND (type = 'REVENUE')"
  )
  expect(addr2sql('income.statement.LISTED_DIVIDEND', {})).toBe(
    "(data->>'tax' = 'LISTED_DIVIDEND') AND (data->>'plugin' = 'SomeImport') AND (type = 'REVENUE')"
  )
  expect(addr2sql('income.statement.TRADE_PROFIT_STOCK', {})).toBe(
    "(data->>'tax' = 'TRADE_PROFIT_STOCK') AND (data->>'plugin' = 'SomeImport') AND (type = 'REVENUE')"
  )
  expect(addr2sql('investment.currency.EUR', {})).toBe(
    null
  )
  expect(addr2sql('investment.statement.NREQ', {})).toBe(
    "(data->>'tax' = 'NREQ') AND (data->>'plugin' = 'SomeImport') AND (type = 'EQUITY')"
  )
  expect(addr2sql('tax.currency.EUR', {})).toBe(
    null
  )
  expect(addr2sql('tax.statement.CORPORATE_TAX', {})).toBe(
    "(data->>'tax' = 'CORPORATE_TAX') AND (type = 'LIABILITY' OR type = 'ASSET')"
  )
  expect(addr2sql('tax.statement.NEEDS_MANUAL_INSPECTION', {})).toBe(
    "(data->>'tax' = 'NEEDS_MANUAL_INSPECTION') AND (type = 'LIABILITY' OR type = 'ASSET')"
  )
  expect(addr2sql('tax.statement.PENALTY_OF_DELAY', {})).toBe(
    "(data->>'tax' = 'PENALTY_OF_DELAY') AND (type = 'LIABILITY' OR type = 'ASSET')"
  )
  expect(addr2sql('tax.statement.TAX_AT_SOURCE', {})).toBe(
    "(data->>'tax' = 'TAX_AT_SOURCE') AND (type = 'LIABILITY' OR type = 'ASSET')"
  )
  expect(addr2sql('tax.statement.VAT_DELAYED_PAYABLE', {})).toBe(
    "(data->>'tax' = 'VAT_DELAYED_PAYABLE') AND (type = 'LIABILITY' OR type = 'ASSET')"
  )
  expect(addr2sql('tax.statement.VAT_FROM_PURCHASES', {})).toBe(
    "(data->>'tax' = 'VAT_FROM_PURCHASES') AND (type = 'LIABILITY' OR type = 'ASSET')"
  )
  expect(addr2sql('tax.statement.VAT_FROM_SALES', {})).toBe(
    "(data->>'tax' = 'VAT_FROM_SALES') AND (type = 'LIABILITY' OR type = 'ASSET')"
  )
  expect(addr2sql('tax.statement.VAT_RECEIVABLE', {})).toBe(
    "(data->>'tax' = 'VAT_RECEIVABLE') AND (type = 'LIABILITY' OR type = 'ASSET')"
  )
  expect(addr2sql('tax.statement.WITHHOLDING_TAX', {})).toBe(
    "(data->>'tax' = 'WITHHOLDING_TAX') AND (type = 'LIABILITY' OR type = 'ASSET')"
  )
  expect(addr2sql('trade.currency.EUR', {})).toBe(
    "(data->>'tax' = 'CASH') AND (data->>'plugin' = 'SomeImport') AND (data->>'currency' = 'EUR' OR data->>'currency' IS NULL) AND (type = 'ASSET')"
  )
  expect(addr2sql('trade.currency.USD', {})).toBe(
    "(data->>'tax' = 'CASH') AND (data->>'currency' = 'USD') AND (data->>'plugin' = 'SomeImport') AND (type = 'ASSET')"
  )
  expect(addr2sql('trade.stock.*', {})).toBe(
    "(data->>'tax' = 'CURRENT_PUBLIC_STOCK_SHARES') AND (data->>'currency' = '*') AND (data->>'plugin' = 'SomeImport') AND (type = 'ASSET')"
  )
  expect(addr2sql('trade.crypto.*', {})).toBe(
    "(data->>'tax' = 'CURRENT_CRYPTOCURRENCIES') AND (data->>'currency' = '*') AND (data->>'plugin' = 'SomeImport') AND (type = 'ASSET')"
  )
  /*
  expect(addr2sql('transfer.currency.EUR', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.Coinbase', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.Lynx', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.NEEDS_MANUAL_INSPECTION', {})).toBe(
    ''
  )
  expect(addr2sql('transfer.external.PayPal', {})).toBe(
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
