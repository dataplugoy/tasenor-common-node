"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasenorExporter = void 0;
const tasenor_common_1 = require("@dataplug/tasenor-common");
const database_1 = require("../database");
const Exporter_1 = require("./Exporter");
const knex_1 = __importDefault(require("knex"));
const dot_object_1 = __importDefault(require("dot-object"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Export Tasenor database.
 */
class TasenorExporter extends Exporter_1.Exporter {
    /**
     * Read configuration information from database and construct compiled configuration.
     * @param db Knex connection to use.
     * @returns
     */
    async getConfig(db) {
        const conf = tasenor_common_1.Bookkeeper.createConfig();
        const settings = {};
        for (const setting of await db('settings').select('*')) {
            settings[setting.name] = setting.value;
        }
        Object.assign(conf, dot_object_1.default.object(settings));
        return conf;
    }
    /**
     * Read all accounts from the database and generate TSV-data.
     * @param db Knex connection to use.
     * @returns
     */
    async getAccounts(db) {
        const headings = {};
        for (const heading of await db('heading').select('*').orderBy('level')) {
            headings[heading.number] = headings[heading.number] || [];
            let tab = '';
            for (let i = 0; i < heading.level; i++) {
                tab += '_';
            }
            heading.text = tab + heading.text;
            headings[heading.number].push(heading);
        }
        const lines = [['# number / title', 'text', 'type', 'tax', 'flags', 'data']];
        for (const account of await db('account').select('*').orderBy('number')) {
            if (headings[account.number]) {
                for (const heading of headings[account.number]) {
                    lines.push([heading.text, '', '', '', '', '']);
                }
            }
            const flags = [];
            if (account.data.favourite)
                flags.push('FAVOURITE');
            const tax = account.data.tax || '';
            delete account.data.tax;
            delete account.data.favourite;
            lines.push([account.number, account.name, account.type, tax, flags.join(' '), Object.keys(account.data).length ? JSON.stringify(account.data) : '']);
        }
        (0, tasenor_common_1.log)(`Found ${lines.length} lines of data for headings and accounts.`);
        return lines;
    }
    /**
     * Read all periods from the database and generate TSV-data.
     * @param db Knex connection to use.
     * @returns
     */
    async getPeriods(db) {
        const lines = [['# start', 'end', 'flags']];
        for (const period of await db('period').select('*').orderBy('start_date')) {
            lines.push([period.start_date, period.end_date, period.locked ? 'LOCKED' : '']);
        }
        (0, tasenor_common_1.log)(`Found ${lines.length} lines of data for periods.`);
        return lines;
    }
    /**
     * Read all entries and documents from the database and generate TSV-data.
     * @param db Knex connection to use.
     * @returns
     */
    async getEntries(db) {
        const lines = [['# number', 'date / account', 'amount', 'text', 'flags']];
        let n = 1;
        for (const period of await db('period').select('*').orderBy('start_date')) {
            lines.push([`Period ${n}`, '', '', '', '']);
            for (const doc of await db('document').select('*').where({ period_id: period.id }).orderBy('period_id', 'number')) {
                lines.push([doc.number, doc.date, '', '', '']);
                for (const entry of await db('entry').join('account', 'entry.account_id', 'account.id').select('entry.*', 'account.number').where({ document_id: doc.id }).orderBy('row_number')) {
                    const flags = [];
                    if (entry.data.vat && entry.data.vat.ignore) {
                        flags.push('VAT_IGNORE');
                    }
                    if (entry.data.vat && entry.data.vat.reconciled) {
                        flags.push('VAT_RECONCILED');
                    }
                    lines.push(['', entry.number, entry.debit ? entry.amount : -entry.amount, entry.description, flags.join(' ')]);
                }
            }
            n++;
        }
        (0, tasenor_common_1.log)(`Found ${lines.length} lines of data for documents and entries.`);
        return lines;
    }
    /**
     * Read all tags from the database and generate TSV-data.
     * @param db Knex connection to use.
     * @param out Directory to write image files.
     * @returns
     */
    async getTags(db, out) {
        const lines = [['# tag', 'name', 'mime', 'picture', 'type', 'order']];
        const picDir = path_1.default.join(out, 'pictures');
        if (!fs_1.default.existsSync(picDir)) {
            fs_1.default.mkdirSync(picDir);
        }
        for (const tag of await db('tags').select('*').orderBy('order')) {
            const ext = tag.mime.split('/')[1];
            const file = `${tag.type}-${tag.order}.${ext}`;
            fs_1.default.writeFileSync(path_1.default.join(picDir, file), tag.picture);
            lines.push([tag.tag, tag.name, tag.mime, path_1.default.join('pictures', file), tag.type, tag.order]);
        }
        (0, tasenor_common_1.log)(`Found ${lines.length} lines of data for tags.`);
        return lines;
    }
    /**
     * Run the full backup for the given database.
     * @param dbUrl Database URL.
     * @param out Directory to save backup.
     * @param destPath Destionation file name if given.
     * @returns Path to the tar-package.
     */
    async run(dbUrl, out, destPath = undefined) {
        const db = database_1.DB.getKnexConfig(dbUrl);
        const conf = await this.dump((0, knex_1.default)(db), out);
        return this.makeTar(conf, out, destPath);
    }
    /**
     * Run the full backup for the given database.
     * @param db Knex database.
     * @param out Directory to save backup.
     * @param destPath Destionation file name if given.
     * @returns Path to the tar-package.
     */
    async runDb(db, out, destPath = undefined) {
        const conf = await this.dump(db, out);
        return this.makeTar(conf, out, destPath);
    }
}
exports.TasenorExporter = TasenorExporter;
//# sourceMappingURL=TasenorExporter.js.map