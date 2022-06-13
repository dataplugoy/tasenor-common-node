"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable camelcase */
const sprintf_js_1 = require("sprintf-js");
const cli_1 = require("../cli");
const tasenor_common_1 = require("@dataplug/tasenor-common");
const clone_1 = __importDefault(require("clone"));
class BalanceCommand extends cli_1.Command {
    addArguments(parser) {
        const sub = parser.add_subparsers();
        const ls = sub.add_parser('ls', { help: 'List account balances' });
        ls.set_defaults({ subCommand: 'ls' });
        ls.add_argument('db', { help: 'Name of the database' });
        ls.add_argument('period', { help: 'Period year, date or ID' });
        const create = sub.add_parser('create', { help: 'Initialize account balances' });
        create.set_defaults({ subCommand: 'create' });
        create.add_argument('--force', '-f', { action: 'store_true', help: 'If given, allow invalid entries to be created', required: false });
        create.add_argument('--map', { help: 'Remap account numbers using JSON or @filepath mapping', required: false });
        create.add_argument('--stock', { nargs: '*', help: 'Define initial stock using JSON or @filepath mapping', required: false });
        create.add_argument('--text', { help: 'A description for the transaction', required: false });
        create.add_argument('db', { help: 'Name of the database' });
        create.add_argument('data', { help: 'A JSON data or @filepath for balances' });
    }
    async ls() {
        const { db, period, verbose } = this.args;
        const periodId = await this.periodId(db, period);
        const resp = await this.get(`/db/${db}/period/${periodId}`);
        await this.readAccounts(db);
        if (!verbose && resp.balances) {
            this.out('balance', resp.balances.reduce((prev, cur) => ({ ...prev, [cur.number]: cur.total }), {}));
            return;
        }
        this.out('balance', resp);
    }
    print(data) {
        Object.keys(data).sort().forEach(number => {
            console.log(number, this.accounts[number].name, '\t', (0, sprintf_js_1.sprintf)('%.2f', data[number] / 100));
        });
    }
    async create() {
        const { db, data, map, stock, text, force } = this.args;
        if (!db) {
            throw new Error(`Invalid database argument ${JSON.stringify(db)}`);
        }
        const dataArg = await this.jsonData(data);
        const mapArg = (map ? await this.jsonData(map) : {});
        const period = await this.singlePeriod(db);
        const stockArg = await this.jsonData(stock);
        // Check if the DB is clean.
        const docs = await this.get(`/db/${db}/document`);
        if (docs.filter(d => d.number !== 0).length && !force) {
            throw new Error('There are already non-initial transactions in the database and cannot be initialized anymore.');
        }
        // Ensure zero balance.
        const sum = Object.values(dataArg).reduce((prev, cur) => prev + cur, 0);
        if (sum) {
            if (force) {
                (0, tasenor_common_1.warning)(`Initial balance total must be zero. Got ${sum} from ${JSON.stringify(dataArg)}.`);
            }
            else {
                throw new Error(`Initial balance total must be zero. Got ${sum} from ${JSON.stringify(dataArg)}.`);
            }
        }
        // Ensure all accounts are valid.
        for (const account of Object.keys(dataArg)) {
            // Zero balance accounts not needed.
            if (!dataArg[account]) {
                continue;
            }
            await this.accountId(db, mapArg[account] || account);
        }
        // Create initial doc.
        const document = (docs.length > 0)
            ? docs[0]
            : await this.post(`/db/${db}/document`, {
                period_id: period.id,
                date: this.date(period.start_date),
                number: 0
            });
        (0, tasenor_common_1.log)(`Created a document #${document.id} on ${period.start_date}.`);
        // Create entries.
        const description = this.str(text) || 'Initial balance';
        for (const account of Object.keys(dataArg)) {
            const destAccount = mapArg[account] || account;
            // Skip zeroes.
            if (!dataArg[account]) {
                (0, tasenor_common_1.log)(`Skipping an entry ${destAccount} ${description} ${(0, sprintf_js_1.sprintf)('%.2f', 0)}.`);
                continue;
            }
            const entry = {
                document_id: document.id,
                account_id: await this.accountId(db, destAccount),
                debit: dataArg[account] >= 0 ? 1 : 0,
                amount: Math.abs(dataArg[account]),
                description
            };
            // Add stock if given.
            if (stockArg[destAccount]) {
                entry.data = {
                    stock: {
                        set: (0, clone_1.default)(stockArg[destAccount])
                    }
                };
                delete stockArg[destAccount];
            }
            // Add data if known.
            const out = await this.post(`/db/${db}/entry`, entry);
            (0, tasenor_common_1.log)(`Created an entry #${out.id} for ${destAccount} ${description} ${(0, sprintf_js_1.sprintf)('%.2f', dataArg[account] / 100)}.`);
        }
        if (Object.keys(stockArg).length) {
            throw new Error(`Unused initial stocks for accounts ${Object.keys(stockArg).join(', ')}`);
        }
    }
    async run() {
        await this.runBy('subCommand');
    }
}
exports.default = BalanceCommand;
//# sourceMappingURL=balance.js.map