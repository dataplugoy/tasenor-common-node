import { AccountElement, AccountAddress, FilterRule, Language, UIQuery, TasenorElement, AccountNumber } from '@dataplug/tasenor-common';
import { ButtonElement, InteractiveElement, MessageElement, ProcessConfig, TextFileLine } from 'interactive-elements';
/**
 * Injected dependecies for UI query generator.
 */
export interface TransactionUIDependencies {
    getAccountCanditates(addr: AccountAddress, config: ProcessConfig): Promise<AccountNumber[]>;
    getTranslation(text: string, language: Language): Promise<string>;
}
/**
 * A RISP generator creating UI definitions for various questions.
 */
export declare class TransactionUI {
    private deps;
    constructor(deps: TransactionUIDependencies);
    /**
     * Ensure that variable is in the configuration. If not throw AskUI exception to ask it from the user.
     * @param config
     * @param variable
     */
    getConfigOrAsk(config: ProcessConfig, variable: string, element: InteractiveElement): Promise<unknown>;
    /**
     * Throw a query for boolean value if not in the configuration.
     * @param config
     * @param variable
     * @param description
     */
    getBoolean(config: ProcessConfig, variable: string, description: string): Promise<unknown>;
    /**
     * Get the translation for the text to the currently configured language.
     * @param text
     * @returns
     */
    getTranslation(text: string, language: Language): Promise<string>;
    /**
     * Construct a translated label for an account dropdown.
     * @param accType
     * @returns
     */
    accountLabel(accType: AccountAddress, language: Language): Promise<string>;
    /**
     * Construct a filter for account family.
     * @param config
     * @param accType
     * @returns
     */
    accountFilter(accType: AccountAddress): FilterRule;
    /**
     * Construct a query for an account by its address.
     * @param missing
     */
    account(config: ProcessConfig, account: AccountAddress, defaultAccount?: AccountNumber | undefined): Promise<AccountElement>;
    /**
     * Interrupt with a query asking an account.
     * @param account
     * @param language
     */
    throwGetAccount(config: ProcessConfig, address: AccountAddress): Promise<never>;
    /**
     * Ask for account to be used for negatice balance instead of the account itself.
     * @param address
     * @param language
     */
    throwDebtAccount(config: ProcessConfig, account: AccountNumber, address: AccountAddress): Promise<never>;
    /**
     * Construct a query for asking about grouping of accounts and account number for group if selected.
     * @param accounts
     * @param language
     * @returns
     */
    accountGroup(config: ProcessConfig, accounts: AccountAddress[]): Promise<TasenorElement>;
    /**
     * Submit button for UI configuration.
     * @param language
     * @returns
     */
    submit(label: string, objectWrapLevel: number, language: Language): Promise<ButtonElement>;
    /**
     * A UI message.
     * @param message
     */
    message(text: string, severity: 'info' | 'warning' | 'error' | 'success'): Promise<MessageElement>;
    /**
     * Throw an error message with Retry button.
     * @param message
     */
    throwErrorRetry(message: string, language: Language): Promise<void>;
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
    parseQuery(name: string, query: UIQuery, language: Language): Promise<TasenorElement>;
    /**
     * Construct UI for general query.
     * @param UIQuery
     * @param language
     */
    query(name: string, query: UIQuery | UIQuery[], lines: TextFileLine[] | null, language: Language): Promise<TasenorElement>;
    /**
     * Construct a query and throw it immediately.
     * @param name
     * @param query
     * @param lines
     * @param language
     */
    throwQuery(name: string, query: UIQuery | UIQuery[], lines: TextFileLine[] | null, language: Language): Promise<never>;
    /**
     * Throw UI exception in order to collect more information from UI.
     * @param element
     */
    throw(element: TasenorElement): never;
    /**
     * Construct a descriptor of context lines needed to display in a question.
     * @param lines
     * @param language
     * @returns
     */
    describeLines(lines: TextFileLine[], language: Language): Promise<InteractiveElement>;
    /**
     * Construct a query asking one of the options in order to store to the configuration.
     * @param text
     * @param variable
     * @param options
     */
    throwRadioQuestion(text: any, variable: any, options: any, language: Language): Promise<never>;
    /**
     * Pass control to the rule editor when found a line not matching a filter.
     * @param lines
     * @param language
     */
    throwNoFilterMatchForLine(lines: TextFileLine[], config: ProcessConfig): Promise<never>;
}
