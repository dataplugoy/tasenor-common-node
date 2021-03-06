"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportPlugin = void 0;
const tasenor_common_1 = require("@dataplug/tasenor-common");
const fs_1 = __importDefault(require("fs"));
const BackendPlugin_1 = require("./BackendPlugin");
/**
 * A plugin providing import services for one or more file formats.
 */
class ImportPlugin extends BackendPlugin_1.BackendPlugin {
    constructor(handler) {
        super();
        this.handler = handler;
        this.UI = handler.UI;
        // This class is used as its own for translations. Let us initialize it.
        this.languages = this.getLanguages();
    }
    /**
     * Get common translations for all import plugins.
     * @returns
     */
    getLanguages() {
        return {
            en: {
                'account-debt-currency': 'Account for recording debt in {asset} currency',
                'account-deposit-currency': 'Account for depositing {asset} currency',
                'account-deposit-external': 'Account for external deposit source for {asset}',
                'account-distribution-currency': 'Account to pay our {asset} dividends from',
                'account-distribution-statement': 'Account to record our dividend payments for {asset}',
                'account-dividend-currency': 'Account for recording received {asset} dividends',
                'account-expense-currency': 'Account for expenses in {asset} currency',
                'account-expense-statement': 'Account for recording expense {asset}',
                'account-fee-currency': 'Account for fees in {asset} currency',
                'account-fee-crypto': 'Account for fees in {asset} crypto currency',
                'account-forex-currency': 'Account for {asset} foreign exchange',
                'account-income-currency': 'Account for income in {asset} currency',
                'account-income-statement': 'Account for recording income {asset}',
                'account-investment-currency': 'Account for receiving investments in {asset} currency',
                'account-investment-statement': 'Account for recording investment {asset}',
                'account-loss-currency': 'Account for recording losses in currency {asset}',
                'account-profit-currency': 'Account for recording profits in currency {asset}',
                'account-tax-currency': 'Account for recording tax in currency {asset}',
                'account-tax-statement': 'Account for tax statament {asset}',
                'account-trade-crypto': 'Account for trading crypto currency {asset}',
                'account-trade-stock': 'Account for trading stocks {asset}',
                'account-trade-currency': 'Account for using currency {asset} for trading',
                'account-transfer-currency': 'Account for transferring currency {asset}',
                'account-transfer-external': 'Account for transferring to/from external source {asset}',
                'account-withdrawal-currency': 'Account for withdrawing currency {asset}',
                'account-withdrawal-external': 'Account for withdrawing from external source {asset}',
                'asset-type-crypto': 'a crypto currency',
                'asset-type-currency': 'a currency',
                'asset-type-external': 'an external instance',
                'asset-type-statement': 'a statement recording',
                'asset-type-stock': 'a stock exchange traded asset',
                'asset-type-short': 'a short position',
                'import-text-buy': 'Buy {takeAmount} {takeAsset}',
                'import-text-correction': '{name}',
                'import-text-deposit': 'Deposit to {exchange} service',
                'import-text-distribution': '{name}',
                'import-text-dividend': 'Dividend {asset}',
                'import-text-expense': '{name}',
                'import-text-forex': 'Sell currency {giveAsset} for {takeAsset}',
                'import-text-income': '{name}',
                'import-text-investment': '{name}',
                'import-text-sell': 'Sell {giveAmount} {giveAsset}',
                'import-text-short-buy': 'Closing short position {takeAmount} {takeAsset}',
                'import-text-short-sell': 'Short selling {giveAmount} {giveAsset}',
                'import-text-tax': '{name}',
                'import-text-trade': 'Trade {giveAmount} {giveAsset} {takeAmount} {takeAsset}',
                'import-text-transfer': '{service} transfer',
                'import-text-withdrawal': 'Withdrawal from {exchange} service',
                'reason-deposit': 'deposit',
                'reason-dividend': 'payment',
                'reason-expense': 'expense',
                'reason-fee': 'fee',
                'reason-forex': 'exchange',
                'reason-income': 'income',
                'reason-loss': 'loss',
                'reason-profit': 'profit',
                'reason-trade': 'trading',
                'reason-transfer': 'transfers',
                'reason-withdrawal': 'withdrawal',
                'note-split': 'Split',
                'note-converted': 'Converted'
            },
            fi: {
                'account-debt-currency': 'Tili veloille valuutassa {asset}',
                'account-deposit-currency': 'Tili valuutan {asset} talletuksille',
                'account-deposit-external': 'Vastatili ulkoisille talletuksille {asset}',
                'account-distribution-currency': 'Tili, josta maksetaan {asset} osingot',
                'account-distribution-statement': 'Raportointitili, johon kirjataan maksettavat osingot {asset}',
                'account-dividend-currency': 'Tili saaduista {asset} osingoista',
                'account-expense-currency': 'Tili kuluille {asset} valuutassa',
                'account-expense-statement': 'Raportointitili {asset} kuluille',
                'account-fee-currency': 'Tili k??ytt??maksuille {asset} valuutassa',
                'account-fee-crypto': 'Tili k??ytt??maksuille {asset} kryptovaluutassa',
                'account-forex-currency': 'Valuutanvaihtotili {asset} valuutalle',
                'account-income-currency': 'Tili tuloille {asset} valuutassa',
                'account-income-statement': 'Raportointitili {asset} tuloille',
                'account-investment-currency': 'Tili saaduille sijoituksille {asset} valuutassa',
                'account-investment-statement': 'Raportointitili sijoituksille {asset} valuutassa',
                'account-loss-currency': 'Tili tappioiden kirjaamiseen {asset} valuutassa',
                'account-profit-currency': 'Raportointitili tappioiden kirjaamiseen {asset} valuutassa',
                'account-tax-currency': 'Verot {asset} valuutassa',
                'account-tax-statement': 'Raportointitili veroille {asset} valuutassa',
                'account-trade-crypto': 'Vaihto-omaisuustili {asset} kryptovaluutalle',
                'account-trade-stock': 'Vaihto-omaisuustili {asset} osakkeelle',
                'account-trade-currency': 'Valuuttatili {asset} valuutalle vaihto-omaisuuden hankintaan',
                'account-transfer-currency': 'Siirtotili {asset} valuutalle',
                'account-transfer-external': 'Siirtotili ulkoiseen kohteeseen {asset} valuutalle',
                'account-withdrawal-currency': 'Nostotili {asset} valuutalle',
                'account-withdrawal-external': 'Vastatili valuutan {asset} nostoille',
                'asset-type-crypto': 'kryptovaluutta',
                'asset-type-currency': 'valuutta',
                'asset-type-external': 'ulkopuolinen instanssi',
                'asset-type-statement': 'raportointi',
                'asset-type-stock': 'osake tai vastaava',
                'asset-type-short': 'lyhyeksi myyty positio',
                'Do you want to import also currency deposits here?': 'Haluatko tuoda my??s valuuttojen talletukset t??nne?',
                'Do you want to import also currency withdrawals here?': 'Haluatko tuoda my??s valuuttojen nostot t??nne?',
                'import-text-buy': 'Osto {takeAmount} {takeAsset}',
                'import-text-correction': '{name}',
                'import-text-deposit': 'Talletus {exchange}-palveluun',
                'import-text-distribution': '{name}',
                'import-text-dividend': 'Osinko {asset}',
                'import-text-expense': '{name}',
                'import-text-forex': 'Valuutanvaihto',
                'import-text-investment': '{name}',
                'import-text-sell': 'Myynti {giveAmount} {giveAsset}',
                'import-text-short-buy': 'Suljettu lyhyeksimyynti {takeAmount} {takeAsset}',
                'import-text-short-sell': 'Lyhyeksimyynti {giveAmount} {giveAsset}',
                'import-text-tax': '{name}',
                'import-text-trade': 'Vaihto {giveAmount} {giveAsset} {takeAmount} {takeAsset}',
                'import-text-transfer': '{service} siirto',
                'import-text-withdrawal': 'Nosto {exchange}-palvelusta',
                'Parsing error in expression `{expr}`: {message}': 'Virhe laskukaavassa `{expr}`: {message}',
                'reason-deposit': 'talletus',
                'reason-dividend': 'maksu',
                'reason-expense': 'meno',
                'reason-fee': 'kulu',
                'reason-forex': 'vaihto',
                'reason-income': 'tulo',
                'reason-loss': 'tappio',
                'reason-profit': 'tuotto',
                'reason-trade': 'vaihdanta',
                'reason-transfer': 'siirto',
                'reason-withdrawal': 'nosto',
                'Retried successfully': 'Uudelleenyritys onnistui',
                'Retry failed': 'Uudelleenyritys ei onnistunut',
                'Select one of the following:': 'Valitse yksi seuraavista:',
                'Additional information needed': 'Tarvitaan lis??tietoja',
                'Based on the following imported lines': 'Seuraavien tuotujen rivien perusteella',
                'Do you want to use the same account for all of them?': 'Haluatko k??ytt???? samaa tili?? kaikille samanlaisille?',
                Created: 'Luotuja',
                Duplicates: 'Aiemmin luotuja',
                Ignored: 'V??liinj??tettyj??',
                'Account Changes': 'Tilien muutokset',
                'Process Was Successfully Completed!': 'Prosessointi saatu p????t??kseen onnistuneesti!',
                'Do we allow short selling of assets?': 'Sallitaanko lyhyeksi myynti?',
                January: 'tammikuu',
                February: 'helmikuu',
                March: 'maaliskuu',
                April: 'huhtikuu',
                May: 'toukokuu',
                June: 'kes??kuu',
                July: 'hein??kuu',
                August: 'elokuu',
                September: 'syyskuu',
                October: 'lokakuu',
                November: 'marraskuu',
                December: 'joulukuu',
                'note-split': 'splitti',
                'note-converted': 'konvertoitu',
                'The account below has negative balance. If you want to record it to the separate debt account, please select another account below:': 'Tilill?? {account} on negatiivinen saldo. Jos haluat kirjata negatiiviset saldot erilliselle velkatilille, valitse tili seuraavasta:',
                'Additional loan taken': 'Lainanoton lis??ys',
                'Loan paid back': 'Lainan takaisinmaksu',
                'The date {date} falls outside of the period {firstDate} to {lastDate}.': 'P??iv??m????r?? {date} on tilikauden {firstDate} - {lastDate} ulkopuolella.',
                'What do we do with that kind of transactions?': 'Mit?? t??m??nkaltaisille tapahtumille tulisi tehd???',
                'Ignore transaction': 'J??tt???? v??liin',
                'Halt with an error': 'Keskeytt???? tuonti virheeseen',
                'Is transaction fee of type {type} already included in the {reason} total?': 'Onko {reason}-tapahtumassa tyypin {type} kulut lis??tty valmiiksi yhteissummaan?'
            }
        };
    }
    /**
     * Get instance of internal handler class.
     * @returns
     */
    getHandler() {
        return this.handler;
    }
    /**
     * Load and return default rules from the JSON-rules file.
     * @returns
     */
    getRules() {
        const path = this.filePath('rules.json');
        (0, tasenor_common_1.log)(`Reading rules ${path}.`);
        return JSON.parse(fs_1.default.readFileSync(path).toString('utf-8')).rules;
    }
}
exports.ImportPlugin = ImportPlugin;
//# sourceMappingURL=ImportPlugin.js.map