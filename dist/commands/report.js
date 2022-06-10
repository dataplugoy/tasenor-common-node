"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable camelcase */
const sprintf_js_1 = require("sprintf-js");
const cli_1 = require("../cli");
class ReportCommand extends cli_1.Command {
    addArguments(parser) {
        const sub = parser.add_subparsers();
        const ls = sub.add_parser('ls', { help: 'List of reports' });
        ls.set_defaults({ subCommand: 'ls' });
        ls.add_argument('db', { help: 'Name of the database' });
        const view = sub.add_parser('view', { help: 'Show a report' });
        view.set_defaults({ subCommand: 'view' });
        view.add_argument('db', { help: 'Name of the database' });
        view.add_argument('report', { help: 'Name of the report' });
        view.add_argument('period', { help: 'Period year, date or ID' });
    }
    async ls() {
        const { db } = this.args;
        const resp = await this.get(`/db/${db}/report`);
        this.out('report', resp);
    }
    async view() {
        const { db, period, report } = this.args;
        const periodId = await this.periodId(db, period);
        const resp = await this.get(`/db/${db}/report/${report}/${periodId}`);
        this.out('report', resp);
    }
    print(data) {
        if ('options' in data) {
            Object.keys(data.options).forEach((opt) => console.log(opt));
            return;
        }
        if ('data' in data) {
            const report = data;
            // Header.
            console.log();
            console.log(report.format);
            console.log();
            // Meta data.
            if ('meta' in data) {
                Object.keys(report.meta).forEach((meta) => console.log(`${meta}: ${report.meta[meta]}`));
                console.log();
            }
            // Collect data to tables.
            const lines = [];
            const columns = data.columns || [];
            // Set up title line.
            let line = [];
            for (const column of columns) {
                line.push(column.title);
            }
            lines.push(line);
            // Render each report line.
            for (const item of report.data) {
                line = [];
                for (const column of columns) {
                    const text = {
                        name: () => item.name,
                        numeric: () => item.amounts && item.amounts[column.name] !== undefined && (0, sprintf_js_1.sprintf)('%.2f', (item.amounts[column.name] || 0) / 100)
                    }[column.type]();
                    line.push(text || '');
                }
                lines.push(line);
            }
            // Find the longest line per column.
            const spaces = columns.map(() => '');
            for (let i = 0; i < lines.length; i++) {
                for (let j = 0; j < columns.length; j++) {
                    if (lines[i][j].length > spaces[j].length) {
                        spaces[j] = lines[i][j].replace(/./g, ' ');
                    }
                }
            }
            // Display.
            for (let i = 0; i < lines.length; i++) {
                let str = '';
                for (let j = 0; j < columns.length; j++) {
                    str += (lines[i][j] + spaces[j] + ' ').substr(0, spaces[j].length + 1);
                }
                console.log(str);
            }
            return;
        }
        throw new Error('Default output not implented.');
    }
    async run() {
        await this.runBy('subCommand');
    }
}
exports.default = ReportCommand;
//# sourceMappingURL=report.js.map