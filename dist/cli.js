"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cli = exports.CLI = exports.CLIRunner = exports.Command = void 0;
/* eslint-disable camelcase */
/**
 * Command line interface utilities.
 *
 * @module tasenor-common-node/src/cli
 */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const glob_1 = __importDefault(require("glob"));
const readline_1 = __importDefault(require("readline"));
const form_data_1 = __importDefault(require("form-data"));
const argparse_1 = require("argparse");
const tasenor_common_1 = require("@dataplug/tasenor-common");
const clone_1 = __importDefault(require("clone"));
let readlineInterface;
/**
 * Ask a question on the console and return answer.
 * @param question
 * @returns
 */
function ask(question) {
    if (!readlineInterface) {
        readlineInterface = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    return new Promise((resolve) => {
        readlineInterface.question(question ? `${question} ` : '>', (text) => { resolve(text); });
    });
}
/**
 * Exit hook that needs to be called if used functions in this library.
 */
function exit() {
    if (readlineInterface)
        readlineInterface.close();
}
/**
 * A command implementation base class.
 */
class Command {
    constructor(cli) {
        this.cli = cli;
    }
    get verbose() {
        return !!this.args.verbose;
    }
    get debug() {
        return !!this.args.debug;
    }
    /**
     * Add command specific arguments.
     * @param parser
     */
    addArguments(parser) {
    }
    /**
     * Set command arguments.
     * @param args
     */
    setArgs(args) {
        this.args = args;
    }
    /**
     * Default output.
     * @param data
     */
    print(data) {
        throw new Error(`Class ${this.constructor.name} does not implement print().`);
    }
    /**
     * Print out data structure according to the selected options.
     * @param data
     */
    out(prefix, data) {
        if (this.args.json) {
            console.log(JSON.stringify(data, null, 2));
        }
        else {
            if (!this.verbose) {
                try {
                    this.print(data);
                    return;
                }
                catch (err) {
                    // If not implemented, do default verbose output.
                    if (!/does not implement print/.test(`${err}`)) {
                        throw err;
                    }
                }
            }
            const print = (prefix, obj) => {
                if (typeof obj === 'object') {
                    if (obj === null) {
                        console.log(`${prefix} = null`);
                    }
                    else if (obj instanceof Array) {
                        for (let i = 0; i < obj.length; i++) {
                            console.log(`${prefix}[${i}]`);
                            print(`  ${prefix}[${i}]`, obj[i]);
                        }
                    }
                    else {
                        for (const key of Object.keys(obj)) {
                            print(`  ${prefix}.${key}`, obj[key]);
                        }
                    }
                }
                else {
                    console.log(`${prefix} =`, obj);
                }
            };
            print(prefix, data);
        }
    }
    /**
     * Entry point for running the command.
     * @param args
     */
    async run() {
        throw new Error(`A command ${this.constructor.name} does not implement run().`);
    }
    /**
     * Construct a form data instance for a file.
     * @param filePath
     * @returns
     */
    formForFile(filePath) {
        const form = new form_data_1.default();
        const buf = fs_1.default.readFileSync(filePath);
        form.append('file', buf, path_1.default.basename(filePath));
        return form;
    }
    /**
     * Call the GET API.
     * @param api
     */
    async get(api) {
        await this.cli.login();
        const resp = await this.cli.request('GET', api);
        if (!resp.success) {
            throw new Error(`Call to GET ${api} failed: ${JSON.stringify(resp)}`);
        }
        return resp.data;
    }
    /**
     * Call the GET UI API.
     * @param api
     */
    async getUi(api) {
        await this.cli.login();
        const resp = await this.cli.requestUi('GET', api);
        if (!resp.success) {
            throw new Error(`Call to GET UI ${api} failed: ${JSON.stringify(resp)}`);
        }
        return resp.data;
    }
    /**
     * Call the DELETE API.
     * @param api
     */
    async delete(api) {
        await this.cli.login();
        const resp = await this.cli.request('DELETE', api);
        if (!resp.success) {
            throw new Error(`Call to DELETE ${api} failed: ${JSON.stringify(resp)}`);
        }
        return resp.data;
    }
    /**
     * Call the DELETE API.
     * @param api
     */
    async deleteUi(api, args = undefined) {
        await this.cli.login();
        const resp = await this.cli.requestUi('DELETE', api, args);
        if (!resp.success) {
            throw new Error(`Call to DELETE UI ${api} failed: ${JSON.stringify(resp)}`);
        }
        return resp.data;
    }
    /**
     * Call the PATCH API.
     * @param api
     */
    async patch(api, data) {
        await this.cli.login();
        const resp = await this.cli.request('PATCH', api, data);
        if (!resp.success) {
            throw new Error(`Call to PATCH ${api} failed: ${JSON.stringify(resp)}`);
        }
        return resp.data;
    }
    /**
     * Call the POST API.
     * @param api
     */
    async post(api, data) {
        await this.cli.login();
        const resp = await this.cli.request('POST', api, data);
        if (!resp.success) {
            throw new Error(`Call to POST ${api} failed: ${JSON.stringify(resp)}`);
        }
        return resp.data;
    }
    /**
     * Call the POST UI API.
     * @param api
     */
    async postUi(api, data) {
        await this.cli.login();
        const resp = await this.cli.requestUi('POST', api, data);
        if (!resp.success) {
            throw new Error(`Call to POST UI ${api} failed: ${JSON.stringify(resp)}`);
        }
        return resp.data;
    }
    /**
     * An alternative POST call to upload file, when its path is known.
     * @param api
     * @param filePath
     * @returns
     */
    async postUpload(api, filePath) {
        const form = this.formForFile(filePath);
        return this.post(api, form);
    }
    /**
     * Execute member function based on the given argument.
     */
    async runBy(op) {
        const cmd = this.args[op];
        if (!cmd) {
            this.help();
            return;
        }
        if (typeof cmd !== 'string') {
            throw new Error(`Invalid operation argument ${JSON.stringify(cmd)}.`);
        }
        if (!this[cmd]) {
            console.log(this[cmd]);
            throw new Error(`There is no member function '${cmd}' in command class '${this.constructor.name}'.`);
        }
        await this[cmd]();
    }
    /**
     * Ensure string argument.
     * @param arg
     */
    str(arg) {
        if (arg === null || arg === undefined) {
            return '';
        }
        if (typeof arg === 'string') {
            return arg;
        }
        return arg[0];
    }
    /**
     * Ensure numeric argument.
     * @param arg
     */
    num(arg) {
        if (arg === null || arg === undefined) {
            return 0;
        }
        return parseFloat(this.str(arg));
    }
    /**
     * Convert year, date or number to period ID.
     * @param arg
     */
    async periodId(db, periodArg) {
        if (!db) {
            throw new Error(`Invalid database argument ${JSON.stringify(db)}`);
        }
        const period = this.str(periodArg);
        if (!period) {
            throw new Error(`Invalid period argument ${JSON.stringify(period)}`);
        }
        let periods = await this.get(`/db/${db}/period`);
        if (/^\d{4}$/.test(period)) {
            const date = `${period}-06-15`;
            periods = periods.filter(p => p.start_date <= date && date <= p.end_date);
        }
        else if (/^\d{4}-\d{2}-\d{2}$/.test(period)) {
            periods = periods.filter(p => p.start_date <= period && period <= p.end_date);
        }
        else if (/^\d+$/.test(period)) {
            const id = parseInt(period);
            periods = periods.filter(p => p.id === id);
        }
        else {
            throw new Error(`Invalid period argument ${JSON.stringify(period)}`);
        }
        if (periods.length > 1) {
            throw new Error(`Too many periods match to ${JSON.stringify(period)}`);
        }
        if (!periods.length) {
            throw new Error(`No periods found matching ${JSON.stringify(period)}`);
        }
        return periods[0].id;
    }
    /**
     * Ensure that there is only one period in the DB and return its ID.
     * @param dbArg
     * @returns
     */
    async singlePeriod(dbArg) {
        const period = await this.get(`/db/${this.str(dbArg)}/period`);
        if (period.length < 1) {
            throw new Error('There are no periods in the database.');
        }
        if (period.length > 1) {
            throw new Error('There are too many periods in the database to set initial balance.');
        }
        return period[0];
    }
    /**
     * Read in accounts if not yet read.
     */
    async readAccounts(dbArg) {
        if (!this.accounts) {
            this.accounts = {};
            this.accountsById = {};
            const accounts = await this.get(`/db/${this.str(dbArg)}/account`);
            for (const account of accounts) {
                this.accounts[account.number] = account;
                this.accountsById[account.id || 0] = account;
            }
        }
    }
    /**
     * Verify that the given number is valid account and return its ID.
     * @param dbArg
     * @param accountArg
     */
    async accountId(dbArg, accountArg) {
        await this.readAccounts(dbArg);
        const num = this.str(accountArg);
        if (!this.accounts[num]) {
            throw new Error(`No account found matching ${JSON.stringify(accountArg)}`);
        }
        return this.accounts[num].id;
    }
    /**
     * Verify that argument is one or more entry descriptions.
     * @param entryArg
     */
    async entries(dbArg, entryArg) {
        if (!entryArg) {
            throw new Error(`Invalid entry argument ${JSON.stringify(entryArg)}.`);
        }
        const entry = typeof entryArg === 'string' ? [entryArg] : entryArg;
        const ret = [];
        for (const e of entry) {
            const match = /^\s*(\d+)\s+(.+?)\s+([-+]?\d+([,.]\d+)?)$/.exec(e);
            if (!match) {
                throw new Error(`Invalid transaction line ${JSON.stringify(e)}`);
            }
            const amount = Math.round(parseFloat(match[3].replace(',', '.')) * 100);
            ret.push({
                account_id: await this.accountId(dbArg, match[1]),
                number: match[1],
                amount,
                description: match[2]
            });
        }
        return ret;
    }
    /**
     * Verify that the argument is proper date.
     * @param date
     */
    date(dateArg) {
        const date = this.str(dateArg);
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            throw new Error(`Invalid date argument ${JSON.stringify(dateArg)}`);
        }
        return date;
    }
    /**
     * Heuristically parse string to JSON value or string if not parseable.
     * @param value
     */
    value(value) {
        value = this.str(value);
        try {
            return JSON.parse(value);
        }
        catch (err) {
            return value;
        }
    }
    /**
     * Parse either direct JSON data argument or read in file, if string starts with `@`.
     * @param data
     */
    async jsonData(dataArg) {
        if (dataArg instanceof Array) {
            const ret = {};
            for (const data of dataArg) {
                Object.assign(ret, await this.jsonData(data));
            }
            return ret;
        }
        if (!dataArg || typeof dataArg !== 'string') {
            throw new Error(`Invalid JSON data argument ${JSON.stringify(dataArg)}.`);
        }
        let data;
        if (dataArg[0] === '@') {
            data = fs_1.default.readFileSync(dataArg.substring(1)).toString('utf-8');
        }
        else {
            data = dataArg;
        }
        try {
            return JSON.parse(data);
        }
        catch (err) {
            throw new Error(`Failed to parse JSON ${data.substr(0, 1000)}.`);
        }
    }
    /**
     * Read in plugin data if not yet read and return info about the plugin.
     * @param pluginArg
     */
    async plugin(pluginArg) {
        if (!this.plugins) {
            this.plugins = await this.getUi('/internal/plugins');
        }
        if (pluginArg instanceof Array) {
            const result = [];
            for (const plugin of pluginArg) {
                result.push(await this.plugin(plugin));
            }
            return result;
        }
        const code = this.str(pluginArg);
        const plugin = this.plugins.filter(p => p.code === code);
        if (!plugin.length) {
            throw new Error(`Cannot find plugin '${code}'.`);
        }
        return plugin[0];
    }
    /**
     * Get the importer.
     * @param nameArg
     */
    async importer(dbArg, nameArg) {
        if (!this.importers) {
            this.importers = await this.get(`/db/${this.str(dbArg)}/importer`);
        }
        const name = this.str(nameArg);
        const importer = this.importers.filter(p => p.name === name);
        if (!importer.length) {
            throw new Error(`Cannot find importer '${name}'.`);
        }
        return importer[0];
    }
    /**
     * Find the named tag or throw an error.
     * @param name
     */
    async tag(db, name) {
        const resp = await this.get(`/db/${db}/tags`);
        const match = resp.filter(tag => tag.tag === name);
        if (!match.length) {
            throw new Error(`Cannot find a tag '${name}.`);
        }
        return match[0];
    }
    /**
     * Show help.
     */
    help() {
        const args = this.cli.originalArgs.concat(['-h']);
        this.cli.run([], args);
    }
}
exports.Command = Command;
/**
 * An interface for accessing API.
 */
class CLIRunner {
    /**
     * Scan commands and instantiate them to the collection.
     * @param paths
     */
    constructor(...paths) {
        this.commands = {};
        const localPath = path_1.default.join(__dirname, '..', 'dist', 'commands');
        for (const dir of paths.concat(localPath)) {
            for (const cmd of glob_1.default.sync(`${dir}/*.js`)) {
                const name = path_1.default.basename(cmd).replace(/\.js$/, '');
                const CommandClass = require(cmd).default;
                const instance = new CommandClass(this);
                this.commands[name] = instance;
            }
        }
    }
    /**
     * Execute HTTP request.
     * @param method
     * @param url
     * @returns
     */
    async request(method, url, data) {
        const caller = tasenor_common_1.net[method];
        const fullUrl = url.startsWith('/') ? `${this.api}${url}` : `${this.api}/${url}`;
        let result = null;
        let error;
        const max = this.args.retry || 0;
        for (let i = -1; i < max; i++) {
            try {
                result = await caller(fullUrl, data);
                if (result && result.success) {
                    return result;
                }
            }
            catch (err) {
                error = err;
            }
            const delay = (i + 1) * 5;
            (0, tasenor_common_1.note)(`Waiting for ${delay} seconds`);
            await (0, tasenor_common_1.waitPromise)(delay * 1000);
        }
        throw error;
    }
    /**
     * Execute HTTP request against UI API.
     * @param method
     * @param url
     * @returns
     */
    async requestUi(method, url, data) {
        const caller = tasenor_common_1.net[method];
        const fullUrl = url.startsWith('/') ? `${this.uiApi}${url}` : `${this.uiApi}/${url}`;
        return await caller(fullUrl, data);
    }
    /**
     * Log in if we don't have access token yet.
     */
    async login() {
        if (this.token)
            return;
        (0, tasenor_common_1.log)(`Logging in to ${this.api} as ${this.user}`);
        const resp = await this.request('POST', '/auth', { user: this.user, password: this.password });
        if (resp.success && resp.data && resp.data instanceof Object) {
            if ('token' in resp.data && 'refresh' in resp.data) {
                const { token, refresh } = resp.data;
                this.configureApi(this.api, { token: token, refresh: refresh });
                this.configureApi(this.uiApi, { token: token, refresh: refresh });
                this.token = token;
            }
        }
    }
    /**
     * Set up the API.
     * @param tokens
     */
    configureApi(api, tokens = undefined) {
        tasenor_common_1.net.configure({ sites: { [api]: {} } });
        if (tokens) {
            tasenor_common_1.net.setConf(api, 'token', tokens.token);
            tasenor_common_1.net.setConf(api, 'refreshToken', tokens.refresh);
        }
    }
}
exports.CLIRunner = CLIRunner;
/**
 * A class implementing dynamic collection of commands that are automatically looked up when called.
 */
class CLI extends CLIRunner {
    /**
     * Insert defaults for the arguments.
     * @param args
     */
    addDefaults(defaults) {
        for (const def of defaults) {
            const { name, envName, defaultValue } = def;
            if (this.args[name] === undefined) {
                this.args[name] = process.env[envName] || defaultValue;
            }
        }
    }
    /**
     * Parse and execute the command.
     */
    async run(defaults = [], explicitArgs = []) {
        // Helper to extract arguments.
        const pop = (args, name) => {
            const ret = args[name];
            delete args[name];
            if (!ret)
                return '';
            return typeof ret === 'string' ? ret : ret[0];
        };
        const parser = new argparse_1.ArgumentParser({
            description: 'Tasenor command line tool'
        });
        parser.add_argument('command', { help: 'Command handling the operation', choices: Object.keys(this.commands) });
        parser.add_argument('--debug', '-d', { help: 'If set, show logs for requests etc', action: 'store_true', required: false });
        parser.add_argument('--json', { help: 'If set, show output as JSON', action: 'store_true', required: false });
        parser.add_argument('--verbose', '-v', { help: 'If set, show more comprehensive output', action: 'store_true', required: false });
        parser.add_argument('--user', { help: 'User email for logging in (use USERNAME env by default)', type: String, required: false });
        parser.add_argument('--password', { help: 'User password for logging in (use PASSWORD env by default)', type: String, required: false });
        parser.add_argument('--api', { help: 'The server base URL providing Bookkeeper API (use API env by default)', type: String, required: false });
        parser.add_argument('--ui-api', { help: 'The server base URL providing Bookkeeper UI API (use UI_API env by default)', type: String, required: false });
        parser.add_argument('--retry', { help: 'If given, retry this many times if network call fails', type: Number, required: false });
        // Set up args.
        this.originalArgs = explicitArgs.length ? (0, clone_1.default)(explicitArgs) : (0, clone_1.default)(process.argv.splice(2));
        // Find the command and add its arguments.
        let cmd;
        for (let i = 0; i < this.originalArgs.length; i++) {
            if (this.commands[this.originalArgs[i]]) {
                cmd = this.commands[this.originalArgs[i]];
                break;
            }
        }
        if (cmd) {
            cmd.addArguments(parser);
        }
        // Collect and fix arguments.
        this.args = parser.parse_args(this.originalArgs);
        cmd?.setArgs(this.args);
        this.addDefaults(defaults);
        this.user = pop(this.args, 'user');
        this.password = pop(this.args, 'password');
        this.api = pop(this.args, 'api');
        this.uiApi = pop(this.args, 'ui_api');
        delete this.args.command;
        if (!this.args.debug) {
            (0, tasenor_common_1.mute)();
        }
        // Configure net APIs.
        if (this.api) {
            this.configureApi(this.api);
        }
        if (this.uiApi) {
            this.configureApi(this.uiApi);
        }
        cmd && await cmd.run();
    }
}
exports.CLI = CLI;
exports.cli = {
    ask,
    exit
};
//# sourceMappingURL=cli.js.map