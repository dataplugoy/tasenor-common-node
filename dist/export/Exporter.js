"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exporter = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const tasenor_common_1 = require("@dataplug/tasenor-common");
const ts_opaque_1 = require("ts-opaque");
const system_1 = require("../system");
const dayjs_1 = __importDefault(require("dayjs"));
/**
 * Common functionality for exporters.
 */
class Exporter {
    constructor() {
        /**
         * Version number of the file format produced by this exporter.
         */
        this.VERSION = 1;
    }
    /**
     * Read all accounts from the database and generate TSV-data.
     * @param db Knex connection to use.
     * @returns
     */
    async getAccounts(db) {
        throw new Error(`Exporter ${this.constructor.name} does not implement getAccounts().`);
    }
    /**
     * Read all periods from the database and generate TSV-data.
     * @param db Knex connection to use.
     * @returns
     */
    async getPeriods(db) {
        throw new Error(`Exporter ${this.constructor.name} does not implement getPeriods().`);
    }
    /**
     * Read all entries and documents from the database and generate TSV-data.
     * @param db Knex connection to use.
     * @returns
     */
    async getEntries(db) {
        throw new Error(`Exporter ${this.constructor.name} does not implement getEntries().`);
    }
    /**
     * Read configuration information from database and construct compiled configuration.
     * @param db Knex connection to use.
     * @returns
     */
    async getConfig(db) {
        throw new Error(`Exporter ${this.constructor.name} does not implement getConfig().`);
    }
    /**
     * Read all tags from the database and generate TSV-data.
     * @param db Knex connection to use.
     * @param out Directory to write image files.
     * @returns
     */
    async getTags(db, out) {
        throw new Error(`Exporter ${this.constructor.name} does not implement getTags().`);
    }
    /**
     * Write prepared data to TSV file.
     * @param path Output file path.
     * @param lines Data content.
     */
    writeTsv(path, lines) {
        (0, tasenor_common_1.log)(`Writing ${path}`);
        fs_1.default.writeFileSync(path, lines.map(l => l.join('\t')).join('\n') + '\n');
    }
    /**
     * Write prepared data to JSON file.
     * @param path Output file path.
     * @param lines Data content.
     */
    writeJson(path, data) {
        (0, tasenor_common_1.log)(`Writing ${path}`);
        fs_1.default.writeFileSync(path, JSON.stringify(data, null, 4) + '\n');
    }
    /**
     * Save complete backup of the Sqlite database to the given directory.
     * @param db Database connection.
     * @param out Directory to store all files.
     * @returns Configuration constructed from the database.
     */
    async dump(db, out) {
        const accountDir = path_1.default.join(out, 'accounts');
        if (!fs_1.default.existsSync(accountDir)) {
            fs_1.default.mkdirSync(accountDir);
        }
        (0, tasenor_common_1.log)(`Saving file format version ${this.VERSION}.`);
        this.writeJson((0, ts_opaque_1.create)(path_1.default.join(out, 'VERSION')), this.VERSION);
        const conf = await this.getConfig(db);
        this.writeJson((0, ts_opaque_1.create)(path_1.default.join(out, 'settings.json')), conf);
        const accounts = await this.getAccounts(db);
        this.writeTsv((0, ts_opaque_1.create)(path_1.default.join(accountDir, 'fi-EUR.tsv')), accounts);
        const periods = await this.getPeriods(db);
        this.writeTsv((0, ts_opaque_1.create)(path_1.default.join(out, 'periods.tsv')), periods);
        const entries = await this.getEntries(db);
        this.writeTsv((0, ts_opaque_1.create)(path_1.default.join(out, 'entries.tsv')), entries);
        const tags = await this.getTags(db, out);
        this.writeTsv((0, ts_opaque_1.create)(path_1.default.join(out, 'tags.tsv')), tags);
        return conf;
    }
    /**
     * Construct a tar-package for the given configuration from the source directory.
     * @param conf Configuration found from the database.
     * @param out Directory containing files extracted as a backup.
     * @param destPath Destionation file name if given.
     * @returns Path to the tar-package.
     */
    async makeTar(conf, out, destPath) {
        const name = conf.companyName || 'unknown';
        const tar = `${name.replace(/[^-a-zA-Z0-9]/, '_')}-${(0, dayjs_1.default)().format('YYYY-MM-DD')}-export.tgz`;
        const tarPath = `${out}/../${tar}`;
        const dest = process.cwd();
        if (!destPath) {
            destPath = (0, ts_opaque_1.create)(path_1.default.join(dest, tar));
        }
        if (path_1.default.dirname(destPath) === '.') {
            destPath = (0, ts_opaque_1.create)(path_1.default.join(dest, path_1.default.basename(destPath)));
        }
        await (0, system_1.system)(`cd "${out}" && tar cjf "${tarPath}" . && mv "${tarPath}" "${destPath}" && rm -fr ${out}`);
        (0, tasenor_common_1.log)(`Package ready ${destPath}`);
        return destPath;
    }
}
exports.Exporter = Exporter;
//# sourceMappingURL=Exporter.js.map