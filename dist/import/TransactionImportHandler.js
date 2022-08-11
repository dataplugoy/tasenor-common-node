"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionImportHandler = void 0;
const interactive_elements_1 = require("interactive-elements");
const interactive_stateful_process_1 = require("interactive-stateful-process");
const tasenor_common_1 = require("@dataplug/tasenor-common");
const TransferAnalyzer_1 = require("./TransferAnalyzer");
const object_hash_1 = __importDefault(require("object-hash"));
const TransactionUI_1 = require("./TransactionUI");
const TransactionRules_1 = require("./TransactionRules");
const _1 = require(".");
/**
 * Core functionality for all transaction import handlers.
 */
class TransactionImportHandler extends interactive_stateful_process_1.TextFileProcessHandler {
    constructor(name) {
        super(name);
        this.importOptions = {
            parser: 'csv',
            numericFields: [],
            requiredFields: [],
            textField: null,
            totalAmountField: null,
            csv: {}
        };
        this.UI = new TransactionUI_1.TransactionUI(this);
        this.rules = new TransactionRules_1.TransactionRules(this);
    }
    /**
     * By default, we don't support multifile.
     * @param file
     * @returns
     */
    canAppend(file) {
        return false;
    }
    /**
     * Get a single account balance.
     * @param addr
     */
    getBalance(addr) {
        if (!this.analyzer) {
            throw new Error(`Cannot access balance for ${addr} when no analyzer instantiated.`);
        }
        return this.analyzer.getBalance(addr);
    }
    /**
     * Get the translation for the text to the currently configured language.
     * @param text
     * @returns
     */
    async getTranslation(text, language) {
        if (!language) {
            throw new interactive_stateful_process_1.SystemError('Language is compulsory setting for importing, if there are unknowns to ask from UI.');
        }
        return this.system.getTranslation(text, language);
    }
    /**
     * Get the account having matching asset in their code.
     * @param asset
     * @returns
     */
    getAccountCanditates(addr, config) {
        return this.system.connector.getAccountCanditates(addr, config);
    }
    /**
     * Construct grouping for the line data with columns defined using sub class that can generate unique ID per transaction.
     * @param state
     */
    async groupingById(state) {
        state.segments = {};
        for (const fileName of Object.keys(state.files)) {
            // Collect segments from lines.
            for (let n = 0; n < state.files[fileName].lines.length; n++) {
                const line = state.files[fileName].lines[n];
                if (!line.columns || Object.keys(line.columns).length === 0) {
                    continue;
                }
                const id = this.segmentId(line);
                if (!id || !state.segments) {
                    throw new interactive_stateful_process_1.InvalidFile(`The segment ID for ${JSON.stringify(line)} was not found by ${this.constructor.name}.`);
                }
                if (id === interactive_elements_1.NO_SEGMENT) {
                    continue;
                }
                state.segments[id] = state.segments[id] || { id, time: undefined, lines: [] };
                state.segments[id].lines.push({ number: n, file: fileName });
                line.segmentId = id;
            }
            // Calculate time stamps for each segment.
            if (!state.segments) {
                throw new interactive_stateful_process_1.InvalidFile('This cannot happen.');
            }
            Object.values(state.segments).forEach(segment => {
                const stamps = new Set();
                segment.lines.forEach(segmentLine => {
                    const line = state.files[segmentLine.file].lines[segmentLine.number];
                    const time = this.time(line);
                    if (time) {
                        stamps.add(time.getTime());
                    }
                });
                if (stamps.size === 0) {
                    throw new interactive_stateful_process_1.InvalidFile(`Was not able to find timestamps for lines ${JSON.stringify(segment.lines)}.`);
                }
                if (stamps.size > 1) {
                    throw new interactive_stateful_process_1.InvalidFile(`Found more than one (${stamps.size}) canditate for timestamp (${[...stamps]}) from lines ${JSON.stringify(segment.lines)}.`);
                }
                segment.time = new Date([...stamps][0]);
            });
        }
        return state;
    }
    /**
     * Default parser for file data.
     */
    async parse(state, config = {}) {
        switch (this.importOptions.parser) {
            case 'csv':
                return this.parseCSV(state, this.importOptions.csv);
            default:
                throw new interactive_stateful_process_1.SystemError(`Parser '${this.importOptions.parser}' is not implemented.`);
        }
    }
    /**
     * Default segmentation is parsing CSV and then grouping by segment ID constructed for each line.
     * @param state
     * @param files
     * @returns
     */
    async segmentationCSV(process, state, files) {
        const parsed = await this.parse(state, process.config);
        const newState = await this.groupingById(parsed);
        this.debugSegmentation(newState);
        return newState;
    }
    /**
     * Hook to do some post proccessing for segmentation process. Collects standard fields.
     * @param state
     * @returns
     */
    async segmentationPostProcess(state) {
        for (const fileName of Object.keys(state.files)) {
            // Build standard fields.
            const { textField, totalAmountField } = this.importOptions;
            for (let n = 0; n < state.files[fileName].lines.length; n++) {
                const columns = state.files[fileName].lines[n].columns;
                for (const name of this.importOptions.requiredFields) {
                    if (columns[name] === undefined) {
                        columns[name] = '';
                    }
                }
                for (const name of this.importOptions.numericFields) {
                    if (columns[name] !== undefined) {
                        // TODO: We need to allow numberic values as well. Might need some syntax fixing here and there.
                        columns[name] = (columns[name] === '' ? 0 : (0, interactive_elements_1.num)(columns[name]));
                    }
                }
                if (textField) {
                    columns._textField = columns[textField];
                }
                if (totalAmountField) {
                    columns._totalAmountField = columns[totalAmountField];
                }
            }
        }
        return state;
    }
    async segmentation(process, state, files) {
        const result = await this.segmentationPostProcess(await this.segmentationCSV(process, state, files));
        return result;
    }
    /**
     * Helper to dump segmentation results.
     */
    debugSegmentation(state) {
        if (state.files) {
            Object.keys(state.files).forEach(fileName => {
                (0, tasenor_common_1.debug)('SEGMENTATION', `Segmentation of ${fileName}`);
                (0, tasenor_common_1.debug)('SEGMENTATION', state.files[fileName].lines.filter(line => Object.keys(line.columns).length > 0));
            });
        }
    }
    /**
     * Construct a hash for a text line usable as unique segment ID.
     * @param line
     */
    hash(line) {
        // Trim spaces away before calculating hash.
        const obj = Object.entries(line.columns).filter(entry => entry[1] !== undefined).reduce((prev, cur) => ({ ...prev, [cur[0]]: cur[1].trim() }), {});
        return object_hash_1.default.sha1(obj);
    }
    /**
     * Segmentation by ID can use this function to group lines by their ID. By default the hash is used.
     * @param line
     */
    segmentId(line) {
        if (line.columns && Object.keys(line.columns).length) {
            return this.hash(line);
        }
        return interactive_elements_1.NO_SEGMENT;
    }
    /**
     * Find out the timestamp from the line data if any.
     * @param line
     */
    time(line) {
        throw new interactive_stateful_process_1.NotImplemented(`Import class ${this.constructor.name} does not implement time().`);
    }
    /**
     * Default classification constructs lines belonging to each segment and asks subclass to classify them.
     *
     * @param state
     * @param files
     * @returns
     */
    async classification(process, state, files) {
        const newState = {
            stage: 'classified',
            files: state.files,
            segments: state.segments,
            result: {}
        };
        if (state.segments) {
            // Handle segments by date.
            for (const segment of this.sortSegments(state.segments)) {
                const lines = segment.lines.map(fileRef => state.files[fileRef.file].lines[fileRef.number]);
                const result = await this.classifyLines(lines, process.config, state.segments[segment.id]);
                if (newState.result) { // Needed for compiler.
                    newState.result[segment.id] = [result];
                }
            }
        }
        this.debugClassification(newState);
        return newState;
    }
    /**
     * Helper to dump classification results.
     */
    debugClassification(state) {
        if (state.result) {
            Object.keys(state.result).forEach(segmentId => {
                if (state.result && state.result[segmentId]) {
                    (0, tasenor_common_1.debug)('CLASSIFICATION', `Classification of ${segmentId}`);
                    (0, tasenor_common_1.debug)('CLASSIFICATION', state.result[segmentId]);
                }
            });
        }
    }
    /**
     * Implementing this function in the subclass the classification can be done segment by segment.
     * @param lines
     */
    async classifyLines(lines, config, segment) {
        throw new interactive_stateful_process_1.NotImplemented(`Import class ${this.constructor.name} does not implement classifyLines().`);
    }
    /**
     * Collect lines related to the segment.
     * @param state
     * @param segmentId
     */
    getLines(state, segmentId) {
        if (state.segments && state.segments[segmentId]) {
            const segment = state.segments[segmentId];
            const lines = segment.lines.map(line => state.files[line.file].lines[line.number]);
            return lines;
        }
        return null;
    }
    /**
     * Check if all accounts are configured and if not, construct query UI for it.
     * @param state
     * @returns
     */
    async needInputForAnalysis(state, config) {
        if (!state.result || !state.segments) {
            return false;
        }
        const missing = new Set();
        // Use fresh analyzer to avoid messing stock bookkeeping.
        const analyzer = new TransferAnalyzer_1.TransferAnalyzer(this, config, state);
        for (const [segmentId, result] of Object.entries(state.result)) {
            const segment = state.segments[segmentId];
            const items = result;
            // Check if we have accounts.
            for (const transfer of items) {
                for (const acc of await analyzer.collectAccounts(segment, transfer, { findMissing: true })) {
                    missing.add(acc);
                }
            }
            // Find out if some of the missing accounts are actual defined as UI query or perhaps already answered.
            for (const address of missing) {
                if (config.answers) {
                    const answers = config.answers;
                    if ((segmentId in answers) &&
                        (`account.${address}` in answers[segmentId]) &&
                        (answers[segmentId][`account.${address}`] !== undefined)) {
                        missing.delete(address);
                        continue;
                    }
                }
                const [reason, type, asset] = address.split('.');
                const query = await analyzer.getAccountQuery(reason, type, asset);
                const lines = this.getLines(state, segmentId);
                if (!lines) {
                    throw new Error(`Failed to collect lines for segment ${segmentId}.`);
                }
                if (query) {
                    const description = await this.UI.describeLines(lines, config.language);
                    const question = await this.UI.query(`answer.${segmentId}.account.${address}`, query, [], config.language);
                    return new interactive_stateful_process_1.Directions({
                        type: 'ui',
                        element: {
                            type: 'flat',
                            elements: [description, question]
                        }
                    });
                }
            }
        }
        if (!missing.size) {
            return false;
        }
        return this.directionsForMissingAccounts(missing, config);
    }
    /**
     * Study configured accounts and missing accounts and construct appropriate UI query for accounts.
     * @param missing
     * @param config
     * @returns
     */
    async directionsForMissingAccounts(missing, config) {
        // Collect account settings from config.
        const configured = Object.keys(config).filter(key => /^account\.\w+\.\w+\./.test(key));
        // Get reason + type pair grouping and accounts for each group.
        const pairs = {};
        for (const address of configured) {
            const [, reason, type, asset] = address.split('.');
            if (asset !== '*') {
                pairs[`${reason}.${type}`] = pairs[`${reason}.${type}`] || new Set();
                pairs[`${reason}.${type}`].add(`${reason}.${type}.${asset}`);
            }
        }
        for (const address of missing) {
            const [reason, type, asset] = address.split('.');
            pairs[`${reason}.${type}`] = pairs[`${reason}.${type}`] || new Set();
            pairs[`${reason}.${type}`].add(`${reason}.${type}.${asset}`);
        }
        // Check groups and construct query either for single account or grouped accounts.
        const elements = [];
        for (const addresses of Object.values(pairs)) {
            if (addresses.size === 1) {
                if (missing.has([...addresses][0])) {
                    elements.push(await this.UI.account(config, [...addresses][0]));
                }
            }
            else {
                let count = 0;
                for (const address of addresses) {
                    if (missing.has(address))
                        count++;
                }
                if (count) {
                    elements.push(await this.UI.accountGroup(config, [...addresses]));
                }
            }
        }
        if (elements.length === 0) {
            return false;
        }
        elements.push(await this.UI.submit('Continue', 1, config.language));
        return new interactive_stateful_process_1.Directions({
            type: 'ui',
            element: {
                type: 'flat',
                elements
            }
        });
    }
    /**
     * Sort the segments by their date.
     * @param segments
     * @returns
     */
    sortSegments(segments) {
        const time = (entry) => {
            return (typeof entry.time === 'string') ? new Date(entry.time).getTime() : entry.time.getTime();
        };
        return Object.values(segments).sort((a, b) => time(a) - time(b));
    }
    /**
     * Convert transfers to the actual transactions with account numbers.
     * @param state
     * @param files
     */
    async analysis(process, state, files, config) {
        this.analyzer = new TransferAnalyzer_1.TransferAnalyzer(this, config, state);
        if (state.result && state.segments) {
            // Sort segments by timestamp and find the first and the last.
            const segments = this.sortSegments(state.segments);
            let lastResult;
            if (segments.length) {
                let firstTimeStamp;
                // Look for the first valid time stamp.
                const confStartDate = config.firstDate ? new Date(`${config.firstDate}T00:00:00.000Z`) : null;
                for (let i = 0; i < segments.length; i++) {
                    const segmentTime = typeof segments[i].time === 'string' ? new Date(segments[i].time) : segments[i].time;
                    if (!confStartDate || segmentTime >= confStartDate) {
                        firstTimeStamp = segmentTime;
                        break;
                    }
                }
                if (!firstTimeStamp) {
                    throw new Error(`Unable to find any valid time stamps after ${confStartDate}.`);
                }
                lastResult = state.result[segments[segments.length - 1].id];
                await this.analyzer.initialize(firstTimeStamp);
            }
            // Analyze each segment in chronological order.
            for (const segment of segments) {
                const txDesc = state.result[segment.id];
                if (!txDesc) {
                    throw new interactive_stateful_process_1.BadState(`Cannot find results for segment ${segment.id} during analysis (${JSON.stringify(segment)})`);
                }
                for (let i = 0; i < txDesc.length; i++) {
                    txDesc[i] = await this.analyze(txDesc[i], segment, config, state);
                }
            }
            // Refresh debts, if any.
            const balances = this.analyzer.getBalances().filter(balance => balance.mayTakeLoan);
            if (lastResult && balances.length) {
                if (!this.analyzer)
                    throw new Error('No analyzer. Internal error.');
                const lastTxs = lastResult[lastResult.length - 1].transactions;
                for (const balance of balances) {
                    const loanTx = {
                        date: lastTxs[lastTxs.length - 1].date,
                        segmentId: lastTxs[lastTxs.length - 1].segmentId,
                        entries: []
                    };
                    const [loanReason, loanType, loanAsset] = balance.debtAddress.split('.');
                    const loanAccount = await this.analyzer.getAccount(loanReason, loanType, loanAsset);
                    if (balance.account === loanAccount) {
                        continue;
                    }
                    const accountBalance = this.analyzer.getBalance(balance.address) || 0;
                    const debtBalance = this.analyzer.getBalance(balance.debtAddress) || 0;
                    let entry;
                    let entry2;
                    // Take more loan.
                    if ((0, tasenor_common_1.realNegative)(accountBalance)) {
                        const description = await this.getTranslation('Additional loan taken', config.language);
                        // Pay to account.
                        entry = {
                            account: balance.account,
                            amount: -accountBalance,
                            description
                        };
                        // Add to loan.
                        entry2 = {
                            account: loanAccount || '0',
                            amount: accountBalance,
                            description
                        };
                    }
                    else if ((0, tasenor_common_1.realNegative)(debtBalance)) {
                        // Paying back existing loan.
                        const description = await this.getTranslation('Loan paid back', config.language);
                        const payBack = Math.abs(Math.min(-debtBalance, accountBalance));
                        if ((0, tasenor_common_1.realPositive)(payBack)) {
                            // Take from account.
                            entry = {
                                account: balance.account,
                                amount: -payBack,
                                description
                            };
                            // Deduct from loan.
                            entry2 = {
                                account: loanAccount || '0',
                                amount: payBack,
                                description
                            };
                        }
                    }
                    // Add tags and apply.
                    if (entry && entry2) {
                        const tags = await this.analyzer.getTagsForAddr(balance.debtAddress);
                        if (tags) {
                            const prefix = tags instanceof Array ? `[${tags.join('][')}]` : tags;
                            entry.description = `${prefix} ${entry.description}`;
                            entry2.description = `${prefix} ${entry2.description}`;
                        }
                        loanTx.entries.push(entry);
                        this.analyzer.applyBalance(entry);
                        loanTx.entries.push(entry2);
                        this.analyzer.applyBalance(entry2);
                        lastTxs.push(loanTx);
                    }
                }
            }
        }
        const newState = {
            ...state,
            stage: 'analyzed'
        };
        this.debugAnalysis(newState);
        return newState;
    }
    /**
     * Analyze and construct transaction details from a transaction description.
     * @param txs
     */
    async analyze(txs, segment, config, state) {
        if (!this.analyzer) {
            throw new interactive_stateful_process_1.SystemError('Calling analyze() without setting up analyzer.');
        }
        switch (txs.type) {
            case 'transfers':
                return await this.analyzer.analyze(txs, segment, config);
            default:
                throw new interactive_stateful_process_1.NotImplemented(`Cannot analyze yet type '${txs.type}' in ${this.constructor.name}.`);
        }
    }
    /**
     * Dump analysis results.
     * @param state
     */
    debugAnalysis(state) {
        if (state.result !== undefined) {
            Object.keys(state.result).forEach(segmentId => {
                (0, tasenor_common_1.debug)('ANALYSIS', `Analyzed ${segmentId}`);
                if (state.result && segmentId in state.result) {
                    for (const result of state.result[segmentId]) {
                        (0, tasenor_common_1.debug)('ANALYSIS', result.transfers);
                    }
                }
            });
        }
    }
    /**
     * Apply the result using the connector.
     * @param state
     * @param files
     * @returns
     */
    async execution(process, state, files) {
        const output = new tasenor_common_1.TransactionApplyResults();
        if (state.result) {
            for (const segmentId of Object.keys(state.result)) {
                const result = state.result[segmentId];
                for (const res of result) {
                    if (res.transactions) {
                        for (const tx of res.transactions) {
                            if (!tx.executionResult)
                                tx.executionResult = 'not done';
                        }
                    }
                }
            }
            for (const segmentId of Object.keys(state.result)) {
                (0, tasenor_common_1.debug)('EXECUTION', `Execution of segment ${segmentId}`);
                const result = state.result[segmentId];
                for (const res of result) {
                    (0, tasenor_common_1.debug)('EXECUTION', res.transactions);
                    const applied = await this.system.connector.applyResult(process.id, res);
                    output.add(applied);
                }
            }
        }
        // Remove stock data.
        this.analyzer = null;
        return {
            ...state,
            output: output.toJSON(),
            stage: 'executed'
        };
    }
    /**
     * Ask VAT from connector.
     * @param time
     * @param reason
     * @param asset
     * @param currency
     */
    async getVAT(time, transfer, currency) {
        const connector = this.system.connector;
        return connector.getVAT(time, transfer, currency);
    }
    /**
     * Find the rate in the default currency for the asset.
     * If there is information about rates inside the files, this function could be overridden and
     * used for digging actual values. Those values can be collected during parse() call.
     * @param time
     * @param type
     * @param asset
     */
    async getRate(time, type, asset, currency, exchange) {
        if (!(0, _1.isTransactionImportConnector)(this.system.connector)) {
            throw new interactive_stateful_process_1.SystemError('Connector used is not a transaction import connector.');
        }
        return this.system.connector.getRate(time, type, asset, currency, exchange);
    }
}
exports.TransactionImportHandler = TransactionImportHandler;
//# sourceMappingURL=TransactionImportHandler.js.map