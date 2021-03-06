import { ImportAction, ImportStateText, TextFileLine, NO_SEGMENT, SegmentId, ProcessConfig, ImportSegment, ImportState, num } from 'interactive-elements'
import { InvalidFile, ProcessFile, TextFileProcessHandler, NotImplemented, Directions, SystemError, Process, BadState } from 'interactive-stateful-process'
import { TasenorElement, AccountAddress, Asset, AssetExchange, AssetTransfer, AssetTransferReason, AssetType, Currency, Language, TransactionDescription, TransactionApplyResults, debug, realNegative, Transaction, AccountNumber, realPositive, TransactionLine } from '@dataplug/tasenor-common'
import { TransferAnalyzer } from './TransferAnalyzer'
import hash from 'object-hash'
import { TransactionUI } from './TransactionUI'
import { TransactionRules } from './TransactionRules'
import { TransactionImportOptions } from './TransactionImportOptions'
import { isTransactionImportConnector, TransactionImportConnector } from '.'

/**
 * Core functionality for all transaction import handlers.
 */
export class TransactionImportHandler extends TextFileProcessHandler<TasenorElement, ImportAction> {

  public UI: TransactionUI
  public rules: TransactionRules
  private analyzer: TransferAnalyzer | null
  protected importOptions: TransactionImportOptions = {
    parser: 'csv',
    numericFields: [],
    requiredFields: [],
    csv: {}
  }

  constructor(name: string) {
    super(name)
    this.UI = new TransactionUI(this)
    this.rules = new TransactionRules(this)
  }

  /**
   * By default, we don't support multifile.
   * @param file
   * @returns
   */
  canAppend(file: ProcessFile): boolean {
    return false
  }

  /**
   * Get a single account balance.
   * @param addr
   */
  getBalance(addr: AccountAddress): number {
    if (!this.analyzer) {
      throw new Error(`Cannot access balance for ${addr} when no analyzer instantiated.`)
    }
    return this.analyzer.getBalance(addr)
  }

  /**
   * Convert numeric fields to number and fill required fields.
   * @param columns
   */
  lineValues(columns: Record<string, string>): Record<string, number | string> {
    const values: Record<string, number | string> = Object.assign({}, columns)
    for (const name of this.importOptions.requiredFields) {
      if (columns[name] === undefined) {
        values[name] = ''
      }
    }
    for (const name of this.importOptions.numericFields) {
      if (columns[name] !== undefined) {
        values[name] = columns[name] === '' ? 0 : num(columns[name])
      }
    }
    return values
  }

  /**
   * Get the translation for the text to the currently configured language.
   * @param text
   * @returns
   */
  async getTranslation(text: string, language: Language | undefined): Promise<string> {
    if (!language) {
      throw new SystemError('Language is compulsory setting for importing, if there are unknowns to ask from UI.')
    }
    return this.system.getTranslation(text, language)
  }

  /**
   * Get the account having matching asset in their code.
   * @param asset
   * @returns
   */
  getAccountCanditates(addr: AccountAddress, config: ProcessConfig): Promise<AccountNumber[]> {
    return (this.system.connector as TransactionImportConnector).getAccountCanditates(addr, config)
  }

  /**
   * Construct grouping for the line data with columns defined using sub class that can generate unique ID per transaction.
   * @param state
   */
  async groupingById(state: ImportStateText<'segmented'>): Promise<ImportStateText<'segmented'>> {
    state.segments = {}
    for (const fileName of Object.keys(state.files)) {
      // Collect segments from lines.
      for (let n = 0; n < state.files[fileName].lines.length; n++) {
        const line: TextFileLine = state.files[fileName].lines[n]
        if (!line.columns || Object.keys(line.columns).length === 0) {
          continue
        }
        const id: SegmentId | typeof NO_SEGMENT = this.segmentId(line)
        if (!id || !state.segments) {
          throw new InvalidFile(`The segment ID for ${JSON.stringify(line)} was not found by ${this.constructor.name}.`)
        }
        if (id === NO_SEGMENT) {
          continue
        }
        state.segments[id] = state.segments[id] || { id, time: undefined, lines: [] }
        state.segments[id].lines.push({ number: n, file: fileName })
        line.segmentId = id
      }

      // Calculate time stamps for each segment.
      if (!state.segments) {
        throw new InvalidFile('This cannot happen.')
      }
      Object.values(state.segments).forEach(segment => {
        const stamps: Set<number> = new Set()
        segment.lines.forEach(segmentLine => {
          const line = state.files[segmentLine.file].lines[segmentLine.number]
          const time = this.time(line)
          if (time) {
            stamps.add(time.getTime())
          }
        })
        if (stamps.size === 0) {
          throw new InvalidFile(`Was not able to find timestamps for lines ${JSON.stringify(segment.lines)}.`)
        }
        if (stamps.size > 1) {
          throw new InvalidFile(`Found more than one (${stamps.size}) canditate for timestamp (${[...stamps]}) from lines ${JSON.stringify(segment.lines)}.`)
        }
        segment.time = new Date([...stamps][0])
      })
    }

    return state
  }

  /**
   * Default parser for file data.
   */
  async parse(state: ImportStateText<'initial'>, config: ProcessConfig = {}): Promise<ImportStateText<'segmented'>> {
    switch (this.importOptions.parser) {
      case 'csv':
        return this.parseCSV(state, this.importOptions.csv)
      default:
        throw new SystemError(`Parser '${this.importOptions.parser}' is not implemented.`)
    }
  }

  /**
   * Default segmentation is parsing CSV and then grouping by segment ID constructed for each line.
   * @param state
   * @param files
   * @returns
   */
  async segmentationCSV(process: Process<TasenorElement, ImportState, ImportAction>, state: ImportStateText<'initial'>, files: ProcessFile[]): Promise<ImportStateText<'segmented'>> {
    const parsed = await this.parse(state, process.config)
    const newState = await this.groupingById(parsed)
    this.debugSegmentation(newState)
    return newState
  }

  async segmentation(process: Process<TasenorElement, ImportState, ImportAction>, state: ImportStateText<'initial'>, files: ProcessFile[]): Promise<ImportStateText<'segmented'>> {
    return this.segmentationCSV(process, state, files)
  }

  /**
   * Helper to dump segmentation results.
   */
  debugSegmentation(state: ImportStateText<'segmented'>) {
    if (state.files) {
      Object.keys(state.files).forEach(fileName => {
        debug('SEGMENTATION', `Segmentation of ${fileName}`)
        debug('SEGMENTATION', state.files[fileName].lines.filter(line => Object.keys(line.columns).length > 0))
      })
    }
  }

  /**
   * Construct a hash for a text line usable as unique segment ID.
   * @param line
   */
  hash(line: TextFileLine): SegmentId {
    // Trim spaces away before calculating hash.
    const obj = Object.entries(line.columns).filter(entry => entry[1] !== undefined).reduce((prev, cur) => ({ ...prev, [cur[0]]: cur[1].trim() }), {})
    return hash.sha1(obj) as SegmentId
  }

  /**
   * Segmentation by ID can use this function to group lines by their ID. By default the hash is used.
   * @param line
   */
  segmentId(line: TextFileLine): SegmentId | typeof NO_SEGMENT {
    if (line.columns && Object.keys(line.columns).length) {
      return this.hash(line)
    }
    return NO_SEGMENT
  }

  /**
   * Find out the timestamp from the line data if any.
   * @param line
   */
  time(line: TextFileLine): Date | undefined {
    throw new NotImplemented(`Import class ${this.constructor.name} does not implement time().`)
  }

  /**
   * Default classification constructs lines belonging to each segment and asks subclass to classify them.
   *
   * @param state
   * @param files
   * @returns
   */
  async classification(process: Process<TasenorElement, ImportState, ImportAction>, state: ImportStateText<'segmented'>, files: ProcessFile[]): Promise<ImportStateText<'classified'>> {
    const newState: ImportStateText<'classified'> = {
      stage: 'classified',
      files: state.files,
      segments: state.segments,
      result: {}
    }

    if (state.segments) {
      for (const segmentId of Object.keys(state.segments)) {
        const segment = state.segments[segmentId]
        const lines = segment.lines.map(fileRef => state.files[fileRef.file].lines[fileRef.number])
        const result = await this.classifyLines(lines, process.config, state.segments[segmentId])
        if (newState.result) { // Needed for compiler.
          newState.result[segmentId] = [result]
        }
      }
    }

    this.debugClassification(newState)

    return newState
  }

  /**
   * Helper to dump classification results.
   */
  debugClassification(state: ImportStateText<'classified'>) {
    if (state.result) {
      Object.keys(state.result).forEach(segmentId => {
        if (state.result && state.result[segmentId]) {
          debug('CLASSIFICATION', `Classification of ${segmentId}`)
          debug('CLASSIFICATION', state.result[segmentId])
        }
      })
    }
  }

  /**
   * Implementing this function in the subclass the classification can be done segment by segment.
   * @param lines
   */
  async classifyLines(lines: TextFileLine[], config: ProcessConfig, segment: ImportSegment): Promise<TransactionDescription> {
    throw new NotImplemented(`Import class ${this.constructor.name} does not implement classifyLines().`)
  }

  /**
   * Collect lines related to the segment.
   * @param state
   * @param segmentId
   */
  getLines(state: ImportStateText<'classified'>, segmentId: SegmentId): TextFileLine[] | null {
    if (state.segments && state.segments[segmentId]) {
      const segment = state.segments[segmentId]
      const lines: TextFileLine[] = segment.lines.map(line => state.files[line.file].lines[line.number])
      return lines
    }
    return null
  }

  /**
   * Check if all accounts are configured and if not, construct query UI for it.
   * @param state
   * @returns
   */
  async needInputForAnalysis(state: ImportStateText<'classified'>, config: ProcessConfig): Promise<Directions<TasenorElement, ImportAction> | false> {

    if (!state.result || !state.segments) {
      return false
    }

    const missing = new Set<AccountAddress>()
    // Use fresh analyzer to avoid messing stock bookkeeping.
    const analyzer = new TransferAnalyzer(this, config, state)

    for (const [segmentId, result] of Object.entries(state.result)) {
      const segment: ImportSegment = state.segments[segmentId]
      const items: TransactionDescription[] = result as TransactionDescription[]

      // Check if we have accounts.
      for (const transfer of items) {
        for (const acc of await analyzer.collectAccounts(segment, transfer, { findMissing: true }) as AccountAddress[]) {
          missing.add(acc)
        }
      }

      // Find out if some of the missing accounts are actual defined as UI query or perhaps already answered.
      for (const address of missing) {
        if (config.answers) {
          const answers = config.answers as Record<SegmentId, Record<string, unknown>>
          if ((segmentId in answers) &&
            (`account.${address}` in answers[segmentId]) &&
            (answers[segmentId][`account.${address}`] !== undefined)) {

            missing.delete(address)
            continue
          }
        }
        const [reason, type, asset] = address.split('.')
        const query = await analyzer.getAccountQuery(reason as AssetTransferReason, type as AssetType, asset as Asset)
        const lines = this.getLines(state, segmentId)
        if (!lines) {
          throw new Error(`Failed to collect lines for segment ${segmentId}.`)
        }
        if (query) {
          const description = await this.UI.describeLines(lines, config.language as Language)
          const question = await this.UI.query(`answer.${segmentId}.account.${address}`, query, [], config.language as Language)
          return new Directions({
            type: 'ui',
            element: {
              type: 'flat',
              elements: [description, question]
            }
          })
        }
      }
    }

    if (!missing.size) {
      return false
    }

    return this.directionsForMissingAccounts(missing, config)
  }

  /**
   * Study configured accounts and missing accounts and construct appropriate UI query for accounts.
   * @param missing
   * @param config
   * @returns
   */
  async directionsForMissingAccounts(missing: Set<AccountAddress>, config: ProcessConfig): Promise<Directions<TasenorElement, ImportAction> | false> {
    // Collect account settings from config.
    const configured: string[] = Object.keys(config).filter(key => /^account\.\w+\.\w+\./.test(key))

    // Get reason + type pair grouping and accounts for each group.
    const pairs: Record<string, Set<AccountAddress>> = {}
    for (const address of configured) {
      const [, reason, type, asset] = address.split('.')
      if (asset !== '*') {
        pairs[`${reason}.${type}`] = pairs[`${reason}.${type}`] || new Set()
        pairs[`${reason}.${type}`].add(`${reason}.${type}.${asset}` as AccountAddress)
      }
    }
    for (const address of missing) {
      const [reason, type, asset] = address.split('.')
      pairs[`${reason}.${type}`] = pairs[`${reason}.${type}`] || new Set()
      pairs[`${reason}.${type}`].add(`${reason}.${type}.${asset}` as AccountAddress)
    }

    // Check groups and construct query either for single account or grouped accounts.
    const elements: TasenorElement[] = []
    for (const addresses of Object.values(pairs)) {
      if (addresses.size === 1) {
        if (missing.has([...addresses][0])) {
          elements.push(await this.UI.account(config, [...addresses][0]))
        }
      } else {
        let count = 0
        for (const address of addresses) {
          if (missing.has(address)) count++
        }
        if (count) {
          elements.push(await this.UI.accountGroup(config, [...addresses]))
        }
      }
    }

    if (elements.length === 0) {
      return false
    }

    elements.push(await this.UI.submit('Continue', 1, config.language as Language))

    return new Directions({
      type: 'ui',
      element: {
        type: 'flat',
        elements
      }
    })

  }

  /**
   * Convert transfers to the actual transactions with account numbers.
   * @param state
   * @param files
   */
  async analysis(process: Process<TasenorElement, ImportState, ImportAction>, state: ImportStateText<'classified'>, files: ProcessFile[], config: ProcessConfig): Promise<ImportStateText<'analyzed'>> {
    this.analyzer = new TransferAnalyzer(this, config, state)
    const time = (entry): number => {
      return (typeof entry.time === 'string') ? new Date(entry.time).getTime() : entry.time.getTime()
    }
    if (state.result && state.segments) {
      // Sort segments by timestamp and find the first and the last.
      const segments = Object.values(state.segments).sort((a, b) => time(a) - time(b))
      let lastResult: TransactionDescription[] | undefined
      if (segments.length) {
        let firstTimeStamp: Date | undefined
        // Look for the first valid time stamp.
        const confStartDate = config.firstDate ? new Date(`${config.firstDate}T00:00:00.000Z`) : null
        for (let i = 0; i < segments.length; i++) {
          const segmentTime = typeof segments[i].time === 'string' ? new Date(segments[i].time) : segments[i].time
          if (!confStartDate || segmentTime >= confStartDate) {
            firstTimeStamp = segmentTime
            break
          }
        }
        if (!firstTimeStamp) {
          throw new Error(`Unable to find any valid time stamps after ${confStartDate}.`)
        }
        lastResult = state.result[segments[segments.length - 1].id] as TransactionDescription[]
        await this.analyzer.initialize(firstTimeStamp)
      }
      // Analyze each segment in chronological order.
      for (const segment of segments) {
        const txDesc: TransactionDescription[] = state.result[segment.id] as TransactionDescription[]
        if (!txDesc) {
          throw new BadState(`Cannot find results for segment ${segment.id} during analysis (${JSON.stringify(segment)})`)
        }
        for (let i = 0; i < txDesc.length; i++) {
          txDesc[i] = await this.analyze(txDesc[i], segment, config, state)
        }
      }
      // Refresh debts, if any.
      const balances = this.analyzer.getBalances().filter(balance => balance.mayTakeLoan)
      if (lastResult && balances.length) {
        if (!this.analyzer) throw new Error('No analyzer. Internal error.')
        const lastTxs = lastResult[lastResult.length - 1].transactions as Transaction[]
        for (const balance of balances) {
          const loanTx: Transaction = {
            date: lastTxs[lastTxs.length - 1].date,
            segmentId: lastTxs[lastTxs.length - 1].segmentId,
            entries: []
          }
          const [loanReason, loanType, loanAsset] = balance.debtAddress.split('.')
          const loanAccount = await this.analyzer.getAccount(loanReason as AssetTransferReason, loanType as AssetType, loanAsset as Asset)
          if (balance.account === loanAccount) {
            continue
          }
          const accountBalance = this.analyzer.getBalance(balance.address) || 0
          const debtBalance = this.analyzer.getBalance(balance.debtAddress) || 0
          let entry: TransactionLine | undefined
          let entry2: TransactionLine | undefined
          // Take more loan.
          if (realNegative(accountBalance)) {
            const description = await this.getTranslation('Additional loan taken', config.language as Language)
            // Pay to account.
            entry = {
              account: balance.account,
              amount: -accountBalance,
              description
            }
            // Add to loan.
            entry2 = {
              account: loanAccount || '0' as AccountNumber,
              amount: accountBalance,
              description
            }
          } else if (realNegative(debtBalance)) {
            // Paying back existing loan.
            const description = await this.getTranslation('Loan paid back', config.language as Language)
            const payBack = Math.abs(Math.min(-debtBalance, accountBalance))
            if (realPositive(payBack)) {
              // Take from account.
              entry = {
                account: balance.account,
                amount: -payBack,
                description
              }
              // Deduct from loan.
              entry2 = {
                account: loanAccount || '0' as AccountNumber,
                amount: payBack,
                description
              }
            }
          }
          // Add tags and apply.
          if (entry && entry2) {
            const tags = await this.analyzer.getTagsForAddr(balance.debtAddress)
            if (tags) {
              const prefix = tags instanceof Array ? `[${tags.join('][')}]` : tags
              entry.description = `${prefix} ${entry.description}`
              entry2.description = `${prefix} ${entry2.description}`
            }
            loanTx.entries.push(entry)
            this.analyzer.applyBalance(entry)
            loanTx.entries.push(entry2)
            this.analyzer.applyBalance(entry2)
            lastTxs.push(loanTx)
          }
        }
      }
    }

    const newState: ImportStateText<'analyzed'> = {
      ...state,
      stage: 'analyzed'
    }

    this.debugAnalysis(newState)

    return newState
  }

  /**
   * Analyze and construct transaction details from a transaction description.
   * @param txs
   */
  async analyze(txs: TransactionDescription, segment: ImportSegment, config: ProcessConfig, state: ImportStateText<'classified'>): Promise<TransactionDescription> {
    if (!this.analyzer) {
      throw new SystemError('Calling analyze() without setting up analyzer.')
    }
    switch (txs.type) {
      case 'transfers':
        return await this.analyzer.analyze(txs, segment, config)
      default:
        throw new NotImplemented(`Cannot analyze yet type '${txs.type}' in ${this.constructor.name}.`)
    }
  }

  /**
   * Dump analysis results.
   * @param state
   */
  debugAnalysis(state: ImportStateText<'analyzed'>) {
    if (state.result !== undefined) {
      Object.keys(state.result).forEach(segmentId => {
        debug('ANALYSIS', `Analyzed ${segmentId}`)
        if (state.result && segmentId in state.result) {
          for (const result of (state.result[segmentId] as TransactionDescription[])) {
            debug('ANALYSIS', result.transfers)
          }
        }
      })
    }
  }

  /**
   * Apply the result using the connector.
   * @param state
   * @param files
   * @returns
   */
  async execution(process: Process<TasenorElement, ImportState, ImportAction>, state: ImportStateText<'analyzed'>, files: ProcessFile[]): Promise<ImportStateText<'executed'>> {

    const output = new TransactionApplyResults()

    if (state.result) {
      for (const segmentId of Object.keys(state.result)) {
        const result: TransactionDescription[] = state.result[segmentId] as TransactionDescription[]
        for (const res of result) {
          if (res.transactions) {
            for (const tx of res.transactions) {
              if (!tx.executionResult) tx.executionResult = 'not done'
            }
          }
        }
      }
      for (const segmentId of Object.keys(state.result)) {
        debug('EXECUTION', `Execution of segment ${segmentId}`)
        const result: TransactionDescription[] = state.result[segmentId] as TransactionDescription[]
        for (const res of result) {
          debug('EXECUTION', res.transactions)
          const applied = await this.system.connector.applyResult(process.id, res)
          output.add(applied)
        }
      }
    }

    // Remove stock data.
    this.analyzer = null

    return {
      ...state,
      output: output.toJSON(),
      stage: 'executed'
    }
  }

  /**
   * Ask VAT from connector.
   * @param time
   * @param reason
   * @param asset
   * @param currency
   */
  async getVAT(time: Date, transfer: AssetTransfer, currency: Currency): Promise<null | number> {
    const connector: TransactionImportConnector = this.system.connector as TransactionImportConnector
    return connector.getVAT(time, transfer, currency)
  }

  /**
   * Find the rate in the default currency for the asset.
   * If there is information about rates inside the files, this function could be overridden and
   * used for digging actual values. Those values can be collected during parse() call.
   * @param time
   * @param type
   * @param asset
   */
  async getRate(time: Date, type: AssetType, asset: Asset, currency: Currency, exchange: AssetExchange): Promise<number> {
    if (!isTransactionImportConnector(this.system.connector)) {
      throw new SystemError('Connector used is not a transaction import connector.')
    }
    return this.system.connector.getRate(time, type, asset, currency, exchange)
  }
}
