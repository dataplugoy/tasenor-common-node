"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable camelcase */
const cli_1 = require("../cli");
const tasenor_common_1 = require("@dataplug/tasenor-common");
class SettingsCommand extends cli_1.Command {
    addArguments(parser) {
        const sub = parser.add_subparsers();
        const ls = sub.add_parser('ls', { help: 'List all settings' });
        ls.set_defaults({ subCommand: 'ls' });
        ls.add_argument('db', { help: 'Name of the database', nargs: '?' });
        const set = sub.add_parser('set', { help: 'Change a settings' });
        set.set_defaults({ subCommand: 'set' });
        set.add_argument('dest', { help: 'Name of the database, name of the plugin  or `system`' });
        set.add_argument('key', { help: 'Name of the setting' });
        set.add_argument('value', { help: 'New value for the setting' });
    }
    async ls() {
        const { db } = this.args;
        const resp = db ? await this.get(`/db/${db}/settings`) : null;
        const resp2 = await this.get('/system/settings');
        const resp3 = await this.get('/system/settings/plugins');
        const pluginSettings = {};
        // TODO: Could have a flag to show all UI and other stuff.
        Object.keys(resp3).forEach(plugin => {
            pluginSettings[plugin] = resp3[plugin].settings;
        });
        this.out('settings', db
            ? {
                db: resp,
                system: resp2,
                plugin: pluginSettings
            }
            : {
                system: resp2,
                plugins: pluginSettings
            });
    }
    print(data) {
        console.dir(data, { depth: null });
    }
    async set() {
        const { dest, key, value } = this.args;
        const valueArg = await this.value(value);
        const keyArg = this.str(key);
        const destArg = this.str(dest);
        if (destArg === 'system') {
            (0, tasenor_common_1.log)(`Setting system variable ${keyArg} to ${JSON.stringify(valueArg)}.`);
            await this.patch('/system/settings', { [keyArg]: valueArg });
            return;
        }
        const resp = await this.get('/system/settings/plugins');
        if (destArg in resp) {
            (0, tasenor_common_1.log)(`Setting plugin ${destArg} setting ${keyArg} to ${JSON.stringify(valueArg)}.`);
            await this.patch('/system/settings/plugins', { [`${destArg}.${keyArg}`]: valueArg });
            return;
        }
        (0, tasenor_common_1.log)(`Setting databas ${destArg} setting ${keyArg} to ${JSON.stringify(valueArg)}.`);
        await this.patch(`/db/${destArg}/settings`, { [keyArg]: valueArg });
    }
    async run() {
        await this.runBy('subCommand');
    }
}
exports.default = SettingsCommand;
//# sourceMappingURL=settings.js.map