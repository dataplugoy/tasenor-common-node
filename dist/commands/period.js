"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable camelcase */
const tasenor_common_1 = require("@dataplug/tasenor-common");
const cli_1 = require("../cli");
class PeriodCommand extends cli_1.Command {
    addArguments(parser) {
        const sub = parser.add_subparsers();
        const ls = sub.add_parser('ls', { help: 'List all periods' });
        ls.set_defaults({ subCommand: 'ls' });
        ls.add_argument('db', { help: 'Name of the database' });
        const rm = sub.add_parser('rm', { help: 'Delete a period' });
        rm.set_defaults({ subCommand: 'rm' });
        rm.add_argument('db', { help: 'Name of the database' });
        rm.add_argument('id', { help: 'ID of the period' });
        const create = sub.add_parser('create', { help: 'Create a period' });
        create.set_defaults({ subCommand: 'create' });
        create.add_argument('db', { help: 'Name of the database' });
        create.add_argument('start_date', { help: 'First date of the period YYYY-MM-DD' });
        create.add_argument('end_date', { help: 'Final date of the period YYYY-MM-DD' });
    }
    async ls() {
        const { db } = this.args;
        const resp = await this.get(`/db/${db}/period`);
        this.out('period', resp);
    }
    print(data) {
        for (const period of data.sort((a, b) => (a.id || 0) - (b.id || 0))) {
            const { id, start_date, end_date } = period;
            console.log(`#${id} ${start_date} ${end_date}`);
        }
    }
    async rm() {
        const { db, id } = this.args;
        await this.delete(`/db/${db}/period/${id}`);
        (0, tasenor_common_1.log)(`Period ${id} deleted successfully.`);
    }
    async create() {
        const { db, start_date, end_date } = this.args;
        const params = { start_date, end_date };
        await this.post(`/db/${db}/period`, params);
        (0, tasenor_common_1.log)(`Period ${start_date}...${end_date} created successfully.`);
    }
    async run() {
        await this.runBy('subCommand');
    }
}
exports.default = PeriodCommand;
//# sourceMappingURL=period.js.map