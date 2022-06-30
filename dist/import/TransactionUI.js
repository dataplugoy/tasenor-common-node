"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionUI = void 0;
const interactive_stateful_process_1 = require("interactive-stateful-process");
/**
 * A RISP generator creating UI definitions for various questions.
 */
class TransactionUI {
    constructor(deps) {
        this.deps = deps;
    }
    /**
     * Ensure that variable is in the configuration. If not throw AskUI exception to ask it from the user.
     * @param config
     * @param variable
     */
    async getConfigOrAsk(config, variable, element) {
        if (variable in config) {
            return config[variable];
        }
        throw new interactive_stateful_process_1.AskUI({
            type: 'flat',
            elements: [
                element,
                await this.submit('Continue', 1, config.language)
            ]
        });
    }
    /**
     * Throw a query for boolean value if not in the configuration.
     * @param config
     * @param variable
     * @param description
     */
    async getBoolean(config, variable, description) {
        return this.getConfigOrAsk(config, variable, {
            type: 'yesno',
            name: `configure.${variable}`,
            label: await this.getTranslation(description, config.language),
            actions: {}
        });
    }
    /**
     * Get the translation for the text to the currently configured language.
     * @param text
     * @returns
     */
    async getTranslation(text, language) {
        return this.deps.getTranslation(text, language);
    }
    /**
     * Construct a translated label for an account dropdown.
     * @param accType
     * @returns
     */
    async accountLabel(accType, language) {
        const [reason, type, asset] = accType.split('.');
        const text = await this.getTranslation(`account-${reason}-${type}`, language);
        // Resolve name for the asset.
        let name = asset;
        if (type === 'statement') {
            if (reason === 'income') {
                name = await this.getTranslation(`income-${asset}`, language);
            }
            else if (reason === 'expense') {
                name = await this.getTranslation(`expense-${asset}`, language);
            }
            else if (reason === 'tax') {
                name = await this.getTranslation(`tax-${asset}`, language);
            }
        }
        return text.replace('{asset}', name);
    }
    /**
     * Construct a filter for account family.
     * @param config
     * @param accType
     * @returns
     */
    accountFilter(accType) {
        const [reason, type] = accType.split('.');
        if (type === 'debt') {
            // TODO: Should allow both asset and debt type accounts.
            return null;
        }
        switch (`${reason}`) {
            case 'deposit':
            case 'trade':
            case 'withdrawal':
                return { type: 'ASSET' };
            case 'fee':
                return { type: 'EXPENSE' };
        }
        // TODO: Think about the rest combinations. Needs probably account subtypes.
        return null;
    }
    /**
     * Construct a query for an account by its address.
     * @param missing
     */
    async account(account, language, defaultAccount = undefined) {
        const ui = {
            type: 'account',
            name: `configure.account.${account}`,
            actions: {},
            label: await this.accountLabel(account, language),
            filter: this.accountFilter(account)
        };
        if (defaultAccount) {
            ui.defaultValue = defaultAccount;
        }
        else if (account.startsWith('expense.statement.')) {
            const canditates = await this.deps.getAccountCanditates(account);
            if (canditates.length) {
                ui.defaultValue = canditates[0];
                // TODO: Add the rest as preferred, if more than one.
            }
        }
        return ui;
    }
    /**
     * Interrupt with a query asking an account.
     * @param account
     * @param language
     */
    async throwGetAccount(address, language) {
        const account = await this.account(address, language);
        const submit = await this.submit('Continue', 1, language);
        throw new interactive_stateful_process_1.AskUI({
            type: 'flat',
            elements: [
                account,
                submit
            ]
        });
    }
    /**
     * Ask for account to be used for negatice balance instead of the account itself.
     * @param address
     * @param language
     */
    async throwDebtAccount(account, address, language) {
        const text = await this.getTranslation('The account below has negative balance. If you want to record it to the separate debt account, please select another account below.', language);
        const message = await this.message(text, 'info');
        const parts = address.split('.');
        const debtAddr = `debt.${parts[1]}.${parts[2]}`;
        const accountUI = await this.account(debtAddr, language, account);
        const submit = await this.submit('Continue', 1, language);
        throw new interactive_stateful_process_1.AskUI({
            type: 'flat',
            elements: [
                message,
                accountUI,
                submit
            ]
        });
    }
    /**
     * Construct a query for asking about grouping of accounts and account number for group if selected.
     * @param accounts
     * @param language
     * @returns
     */
    async accountGroup(accounts, language) {
        const [reason, type] = accounts[0].split('.');
        const elements = [];
        for (const account of accounts) {
            elements.push(await this.account(account, language));
        }
        return {
            type: 'flat',
            elements: [
                {
                    type: 'boolean',
                    name: `grouping.${reason}.${type}`,
                    label: await this.getTranslation('Do you want to use the same account for all of them?', language),
                    defaultValue: false,
                    actions: {}
                },
                {
                    type: 'case',
                    condition: `grouping.${reason}.${type}`,
                    cases: {
                        true: {
                            type: 'account',
                            name: `configure.account.${reason}.${type}.*`,
                            actions: {},
                            label: await this.accountLabel(`${reason}.${type}.*`, language),
                            filter: this.accountFilter(`${reason}.${type}.*`)
                        },
                        false: {
                            type: 'flat',
                            elements
                        }
                    }
                }
            ]
        };
    }
    /**
     * Submit button for UI configuration.
     * @param language
     * @returns
     */
    async submit(label, objectWrapLevel, language) {
        let errorMessage = await this.getTranslation('Saving failed', language);
        let successMessage = await this.getTranslation('Saved successfully', language);
        if (label === 'Retry') {
            errorMessage = await this.getTranslation('Retry failed', language);
            successMessage = await this.getTranslation('Retried successfully', language);
        }
        return {
            type: 'button',
            label,
            actions: {
                onClick: {
                    type: 'post',
                    url: '',
                    objectWrapLevel,
                    errorMessage,
                    successMessage
                }
            }
        };
    }
    /**
     * A UI message.
     * @param message
     */
    async message(text, severity) {
        return {
            type: 'message',
            severity,
            text
        };
    }
    /**
     * Throw an error message with Retry button.
     * @param message
     */
    async throwErrorRetry(message, language) {
        throw new interactive_stateful_process_1.AskUI({
            type: 'flat',
            elements: [
                await this.message(message, 'error'),
                await this.submit('Retry', 0, language)
            ]
        });
    }
    /**
     * Construct RISP element from UI query.
     *
     * The following questions can be expressed:
     *
     * ### Choose an Option
     *
     * A list of fixed options are given. The display text is a key and the value is the resulting value, if selected.
     * ```json
     * {
     *   "name": "Option Question",
     *   "label": "Choose one of the following:",
     *   "ask": {
     *     "Hardware equipment": "HARDWARE",
     *     "Software": "SOFTWARE"
     *   }
     * }
     * ```
     *
     * ### Choose a Tag
     *
     * An ability to select from predetermined set of tags we can use
     * ```json
     * {
     *   "name": "Tag Selection",
     *   "label": "Select a tag:",
     *   "chooseTag": [ "A", "B", "C" ]
     * }
     * ```
     *
     * ### Explain in Text
     * A simple text box can be used with
     * ```json
     * {
     *   "name": "A Text Box",
     *   "label": "Plase enter the purchase description:",
     *   "text": true
     * }
     * ```
     *
     * @param query
     */
    async parseQuery(name, query, language) {
        if ('ask' in query) {
            // This is just object mapping explanation to values.
            return {
                name,
                type: 'radio',
                label: query.label || await this.getTranslation('Select one of the following:', language),
                actions: {},
                options: query.ask
            };
        }
        else if ('chooseTag' in query) {
            return {
                name,
                type: 'tags',
                label: query.label || await this.getTranslation('Select one of the following:', language),
                actions: {},
                single: true,
                options: query.chooseTag
            };
        }
        else if ('text' in query) {
            return {
                name,
                type: 'text',
                label: query.label || await this.getTranslation('Please enter text:', language),
                actions: {}
            };
        }
        else {
            throw new interactive_stateful_process_1.SystemError(`Unable to parse UI from query ${JSON.stringify(query)}.`);
        }
    }
    /**
     * Construct UI for general query.
     * @param UIQuery
     * @param language
     */
    async query(name, query, lines, language) {
        const elements = [];
        // Construct some reference if we know context.
        if (lines && lines.length) {
            elements.push(await this.describeLines(lines, language));
        }
        if (query instanceof Array) {
            for (const q of query) {
                elements.push(await this.parseQuery(name, q, language));
            }
        }
        else {
            elements.push(await this.parseQuery(name, query, language));
        }
        elements.push(await this.submit('Continue', 2, language));
        return {
            type: 'flat',
            elements
        };
    }
    /**
     * Construct a query and throw it immediately.
     * @param name
     * @param query
     * @param lines
     * @param language
     */
    async throwQuery(name, query, lines, language) {
        const element = await this.query(name, query, lines, language);
        this.throw(element);
    }
    /**
     * Throw UI exception in order to collect more information from UI.
     * @param element
     */
    throw(element) {
        throw new interactive_stateful_process_1.AskUI(element);
    }
    /**
     * Construct a descriptor of context lines needed to display in a question.
     * @param lines
     * @param language
     * @returns
     */
    async describeLines(lines, language) {
        const viewer = lines.map(line => ({
            type: 'textFileLine',
            line
        }));
        return {
            type: 'box',
            elements: [
                {
                    type: 'html',
                    html: `<strong>${await this.getTranslation('Based on the following imported lines', language)}</strong>`
                },
                ...viewer
            ]
        };
    }
    /**
     * Construct a query asking one of the options in order to store to the configuration.
     * @param text
     * @param variable
     * @param options
     */
    async throwRadioQuestion(text, variable, options, language) {
        throw new interactive_stateful_process_1.AskUI({
            type: 'flat',
            elements: [
                {
                    type: 'message',
                    severity: 'info',
                    text
                },
                {
                    type: 'radio',
                    name: `configure.${variable}`,
                    options,
                    actions: {}
                },
                {
                    type: 'button',
                    label: await this.deps.getTranslation('Continue', language),
                    actions: {
                        onClick: {
                            type: 'post',
                            url: '',
                            objectWrapLevel: 1
                        }
                    }
                }
            ]
        });
    }
}
exports.TransactionUI = TransactionUI;
//# sourceMappingURL=TransactionUI.js.map