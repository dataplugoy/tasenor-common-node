"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tasenor_common_1 = require("@dataplug/tasenor-common");
const fs_1 = __importDefault(require("fs"));
const cli_1 = require("../cli");
class DbCommand extends cli_1.Command {
    addArguments(parser) {
        const sub = parser.add_subparsers();
        const ls = sub.add_parser('ls', { help: 'List all databases' });
        ls.set_defaults({ subCommand: 'ls' });
        const create = sub.add_parser('create', { help: 'Create a database' });
        create.set_defaults({ subCommand: 'create' });
        create.add_argument('scheme', { help: 'Bookkeeping scheme plugin code' });
        create.add_argument('databaseName', { help: 'Name of the new database' });
        create.add_argument('companyName', { nargs: '?', help: 'Name of the company (optional)' });
        create.add_argument('companyCode', { nargs: '?', help: 'Registration code of the company (optional)' });
        create.add_argument('language', { nargs: '?', help: 'Database language (optional)' });
        create.add_argument('currency', { nargs: '?', help: 'Currency (optional)' });
        const rm = sub.add_parser('rm', { help: 'Delete a database' });
        rm.set_defaults({ subCommand: 'rm' });
        rm.add_argument('databaseName', { help: 'Name of the database' });
        const upload = sub.add_parser('upload', { help: 'Upload a database' });
        upload.set_defaults({ subCommand: 'upload' });
        upload.add_argument('path', { help: 'Path to the file to upload' });
    }
    async ls() {
        const resp = await this.get('/db');
        this.out('db', resp);
    }
    print(data) {
        for (const db of data) {
            console.log(db.name);
        }
    }
    async rm() {
        const { databaseName } = this.args;
        await this.delete(`/db/${databaseName}`);
        (0, tasenor_common_1.log)(`Database ${databaseName} deleted successfully.`);
    }
    async create() {
        const { scheme, databaseName, companyName, companyCode, language, currency } = this.args;
        const settings = {
            language, currency
        };
        const params = { scheme, databaseName, companyName, companyCode, settings };
        await this.post('/db', params);
        (0, tasenor_common_1.log)(`Database ${databaseName} created successfully.`);
    }
    async upload() {
        const { path } = this.args;
        if (!path || !fs_1.default.existsSync(this.str(path))) {
            throw new Error(`File path ${path} does not exist.`);
        }
        await this.postUpload('/db/upload', path);
        (0, tasenor_common_1.log)(`Database ${path} uploaded successfully.`);
    }
    async run() {
        await this.runBy('subCommand');
    }
}
exports.default = DbCommand;
//# sourceMappingURL=db.js.map