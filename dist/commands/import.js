"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable camelcase */
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
const cli_1 = require("../cli");
const tasenor_common_1 = require("@dataplug/tasenor-common");
class ImportCommand extends cli_1.Command {
    addArguments(parser) {
        const sub = parser.add_subparsers();
        const ls = sub.add_parser('ls', { help: 'List all imports' });
        ls.set_defaults({ subCommand: 'ls' });
        ls.add_argument('db', { help: 'Name of the database' });
        ls.add_argument('name', { help: 'Name of the importer' });
        const create = sub.add_parser('create', { help: 'Import a file' });
        create.set_defaults({ subCommand: 'create' });
        create.add_argument('--first', { help: 'First date of the allowed period YYYY-MM-DD', default: '1900-01-01' });
        create.add_argument('--last', { help: 'Final date of the allowed period YYYY-MM-DD', default: '2999-12-31' });
        create.add_argument('--answers', { help: 'Answer file', required: false });
        create.add_argument('db', { help: 'Name of the database' });
        create.add_argument('name', { help: 'Name of the importer' });
        create.add_argument('file', { help: 'Path to the file to import' });
    }
    async ls() {
        const { db, name } = this.args;
        const importer = await this.importer(db, name);
        const resp = await this.get(`/db/${db}/import/${importer.id}`);
        this.out('import', resp);
    }
    async create() {
        const { db, name, file, answers, first, last } = this.args;
        const importer = await this.importer(db, name);
        const encoding = 'base64';
        const data = fs_1.default.readFileSync(this.str(file)).toString(encoding);
        const type = mime_types_1.default.lookup(file);
        const answersArg = answers ? await this.jsonData(answers) : null;
        const resp = await this.post(`/db/${db}/importer/${importer.id}`, {
            firstDate: first,
            lastDate: last,
            files: [{
                    name: file,
                    encoding,
                    type,
                    data
                }]
        });
        this.out('import', resp);
        if (answersArg) {
            (0, tasenor_common_1.log)(`Uploading answers to process #${resp.processId}`);
            const resp2 = await this.post(`/db/${db}/import/${importer.id}/process/${resp.processId}`, {
                answer: answersArg
            });
            this.out('import', resp2);
        }
    }
    print(data) {
        if ('processId' in data && 'step' in data) {
            (0, tasenor_common_1.log)(`Process ID: ${data.processId}, Step: ${data.step}, ${data.status}`);
            return;
        }
        for (const imp of data.sort((a, b) => (a.id || 0) - (b.id || 0))) {
            const { id, name, status, error } = imp;
            console.log(`#${id} ${name} ${status}`);
            if (error) {
                console.log('  ', error);
            }
            console.log();
        }
    }
    async run() {
        await this.runBy('subCommand');
    }
}
exports.default = ImportCommand;
//# sourceMappingURL=import.js.map