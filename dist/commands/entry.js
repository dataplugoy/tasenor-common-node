"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable camelcase */
const sprintf_js_1 = require("sprintf-js");
const cli_1 = require("../cli");
const tasenor_common_1 = require("@dataplug/tasenor-common");
class EntryCommand extends cli_1.Command {
    addArguments(parser) {
        const sub = parser.add_subparsers();
        const ls = sub.add_parser('ls', { help: 'Find entries matching the filter' });
        ls.set_defaults({ subCommand: 'ls' });
        ls.add_argument('--account', { help: 'Match to this account number', required: false });
        ls.add_argument('--text', { help: 'Match to this exact description', required: false });
        ls.add_argument('db', { help: 'Name of the database' });
        const edit = sub.add_parser('edit', { help: 'Change entries matching the filter' });
        edit.set_defaults({ subCommand: 'edit' });
        edit.add_argument('--account', { help: 'Match to this account number', required: false });
        edit.add_argument('--text', { help: 'Match to this exact description', required: false });
        edit.add_argument('db', { help: 'Name of the database' });
        edit.add_argument('data', { help: 'JSON data for patching the entry' });
    }
    async filter() {
        const { db, account, text } = this.args;
        await this.readAccounts(db);
        const query = [];
        if (account) {
            const id = await this.accountId(db, account);
            query.push(`account_id=${id}`);
        }
        if (text) {
            query.push(`text=${text}`);
        }
        return this.get(`/db/${db}/entry${query.length ? '?' + query.join('&') : ''}`);
    }
    async ls() {
        const resp = await this.filter();
        this.out('entry', resp);
    }
    print(data) {
        for (const entry of data) {
            const { id, account_id, debit, amount, description } = entry;
            console.log(`#${id} ${this.accountsById[account_id || -1].number} ${this.accountsById[account_id || -1].name}`);
            console.log('    ', (0, sprintf_js_1.sprintf)('%.2f', debit ? amount / 100 : amount / -100), '\t', description);
            if (entry.data && Object.keys(entry.data).length) {
                console.log('    ', JSON.stringify(entry.data));
            }
        }
    }
    async edit() {
        const { db, data } = this.args;
        const params = await this.jsonData(data);
        for (const key of Object.keys(params)) {
            switch (key) {
                case 'description':
                    break;
                case 'account':
                    params.account_id = await this.accountId(db, `${params[key]}`);
                    delete params.account;
                    break;
                default:
                    throw new Error(`No handler yet for entry data '${key}'.`);
            }
        }
        const resp = await this.filter();
        for (const entry of resp) {
            (0, tasenor_common_1.log)(`Changing entry #${entry.id} to have ${JSON.stringify(params)}`);
            await this.patch(`/db/${db}/entry/${entry.id}`, params);
        }
    }
    async run() {
        await this.runBy('subCommand');
    }
}
exports.default = EntryCommand;
//# sourceMappingURL=entry.js.map