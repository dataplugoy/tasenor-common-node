"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugins = void 0;
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const tar_1 = __importDefault(require("tar"));
const tasenor_common_1 = require("@dataplug/tasenor-common");
const ts_opaque_1 = require("ts-opaque");
const PLUGIN_FIELDS = ['code', 'title', 'version', 'icon', 'releaseDate', 'use', 'type', 'description'];
// Internal configuration for the module.
const config = {
    BUILD_PATH: undefined,
    DEVELOPMENT_PATH: undefined,
    INSTALL_PATH: undefined,
    PLUGIN_PATH: undefined
};
/**
 * Get the configuration variable or throw an error.
 * @param variable Name of the variable.
 */
function getConfig(variable) {
    const value = config[variable];
    if (value === undefined) {
        throw new Error(`Configuration variable ${variable} is required but it is not set.`);
    }
    return value;
}
/**
 * Set the configuration variable. When setting the root for plugins other directories are set automatically.
 * @param variable Name of the variable.
 * @param value Value of the variable.
 */
function setConfig(variable, value) {
    config[variable] = value;
    if (variable === 'PLUGIN_PATH') {
        if (fs_1.default.existsSync(path_1.default.join(value, 'build'))) {
            setConfig('BUILD_PATH', path_1.default.join(value, 'build'));
        }
        if (fs_1.default.existsSync(path_1.default.join(value, 'Build'))) {
            setConfig('BUILD_PATH', path_1.default.join(value, 'Build'));
        }
        if (fs_1.default.existsSync(path_1.default.join(value, 'installed'))) {
            setConfig('INSTALL_PATH', path_1.default.join(value, 'installed'));
        }
        if (fs_1.default.existsSync(path_1.default.join(value, 'Installed'))) {
            setConfig('INSTALL_PATH', path_1.default.join(value, 'Installed'));
        }
        if (fs_1.default.existsSync(path_1.default.join(value, 'development'))) {
            setConfig('DEVELOPMENT_PATH', path_1.default.join(value, 'development'));
        }
        if (fs_1.default.existsSync(path_1.default.join(value, 'Development'))) {
            setConfig('DEVELOPMENT_PATH', path_1.default.join(value, 'Development'));
        }
    }
}
/**
 * Sort list of plugins according to the code.
 * @param plugins A list of plugins.
 * @returns New sorted list.
 */
function sortPlugins(plugins) {
    return plugins.sort((a, b) => a.code < b.code ? -1 : (a.code > b.code ? 1 : 0));
}
/**
 * Compare two plugin lists if they are essentially the same.
 * @param listA
 * @param listB
 * @returns True if code, versions and path match.
 */
function samePlugins(listA, listB) {
    if (listA.length !== listB.length) {
        return false;
    }
    listA = sortPlugins(listA);
    listB = sortPlugins(listB);
    for (let i = 0; i < listA.length; i++) {
        if (listA[i].id !== listB[i].id ||
            listA[i].code !== listB[i].code ||
            listA[i].installedVersion !== listB[i].installedVersion ||
            listA[i].path !== listB[i].path) {
            return false;
        }
        if (listA[i].versions || listB[i].versions) {
            const versionsA = listA[i].versions || [];
            const versionsB = listB[i].versions || [];
            if (versionsA.length !== versionsB.length) {
                return false;
            }
            for (let j = 0; j < versionsA.length; j++) {
                if (versionsA[j].version !== versionsB[j].version) {
                    return false;
                }
            }
        }
    }
    return true;
}
/**
 * Read in the current `index.json` file.
 */
function loadPluginIndex() {
    if (fs_1.default.existsSync(path_1.default.join(getConfig('PLUGIN_PATH'), 'index.json'))) {
        return JSON.parse(fs_1.default.readFileSync(path_1.default.join(getConfig('PLUGIN_PATH'), 'index.json')).toString('utf-8'));
    }
    return [];
}
/**
 * Find the named plugin from the current `index.json` file.
 * @param {String} code
 * @returns Data or null if not found.
 */
function findPluginFromIndex(code) {
    const index = loadPluginIndex();
    const plugin = index.find(plugin => plugin.code === code);
    return plugin || null;
}
/**
 * Get the current plugin list maintained by ERP.
 * @returns The latest list.
 */
async function fetchOfficialPluginList() {
    const plugins = await tasenor_common_1.ERP_API.call('GET', '/plugins');
    if (plugins.success) {
        return plugins.data;
    }
    return [];
}
/**
 * Construct plugin list from the current `Installed` directory.
 */
function scanInstalledPlugins() {
    const installPath = getConfig('INSTALL_PATH');
    const installPathParts = installPath.split('/');
    const files = glob_1.default.sync(path_1.default.join(installPath, '*', 'plugin.json'));
    const plugins = [];
    for (const file of files) {
        const plugin = JSON.parse(fs_1.default.readFileSync(file).toString('utf-8'));
        const pathParts = file.split('/');
        plugin.path = `${installPathParts[installPathParts.length - 1]}/${pathParts[pathParts.length - 2]}`;
        plugins.push(plugin);
    }
    return plugins;
}
/**
 * Scan for all UI plugins found from the development directory.
 * @returns A list of plugins.
 */
function scanUIPlugins() {
    const files = glob_1.default.sync(path_1.default.join(getConfig('DEVELOPMENT_PATH'), '*', 'index.tsx')).concat(glob_1.default.sync(path_1.default.join(getConfig('DEVELOPMENT_PATH'), '*', 'ui', 'index.tsx')));
    const regex = new RegExp(`^\\s*static\\s+(${PLUGIN_FIELDS.join('|')})\\s*=\\s*(?:'([^']*)'|"([^"]*)")`);
    const plugins = [];
    for (const file of files) {
        let pluginPath;
        const pathParts = file.split('/');
        if (pathParts[pathParts.length - 2] === 'ui') {
            pluginPath = `${pathParts[pathParts.length - 4]}/${pathParts[pathParts.length - 3]}`;
        }
        else {
            pluginPath = `${pathParts[pathParts.length - 3]}/${pathParts[pathParts.length - 2]}`;
        }
        const data = {
            code: (0, ts_opaque_1.create)('Unknown'),
            title: 'Unknown Development Plugin',
            icon: 'HelpOutline',
            path: pluginPath,
            version: (0, ts_opaque_1.create)('0'),
            releaseDate: null,
            use: 'unknown',
            type: 'unknown',
            description: 'No description'
        };
        const code = fs_1.default.readFileSync(file).toString('utf-8').split('\n');
        for (const line of code) {
            const match = regex.exec(line);
            if (match) {
                data[match[1]] = match[2];
            }
        }
        if (data.releaseDate) {
            data.releaseDate = new Date(data.releaseDate);
        }
        plugins.push(data);
    }
    return plugins;
}
/**
 * Scan for all backend plugins found from the development directory.
 * @returns A list of plugins.
 */
function scanBackendPlugins() {
    const files = glob_1.default.sync(path_1.default.join(getConfig('DEVELOPMENT_PATH'), '*', 'index.ts')).concat(glob_1.default.sync(path_1.default.join(getConfig('DEVELOPMENT_PATH'), '*', 'backend', 'index.ts')));
    const regex = new RegExp(`^\\s*this\\.(${PLUGIN_FIELDS.join('|')})\\s*=\\s*(?:'([^']*)'|"([^"]*)")`);
    const plugins = [];
    for (const file of files) {
        const pathParts = file.split('/');
        let pluginPath;
        if (pathParts[pathParts.length - 2] === 'backend') {
            pluginPath = `${pathParts[pathParts.length - 4]}/${pathParts[pathParts.length - 3]}`;
        }
        else {
            pluginPath = `${pathParts[pathParts.length - 3]}/${pathParts[pathParts.length - 2]}`;
        }
        const data = {
            code: (0, ts_opaque_1.create)('Unknown'),
            title: 'Unknown Development Plugin',
            icon: 'HelpOutline',
            path: pluginPath,
            version: (0, ts_opaque_1.create)('0'),
            releaseDate: null,
            use: 'unknown',
            type: 'unknown',
            description: 'No description'
        };
        const code = fs_1.default.readFileSync(file).toString('utf-8').split('\n');
        for (const line of code) {
            const match = regex.exec(line);
            if (match) {
                data[match[1]] = match[2];
            }
        }
        if (data.releaseDate) {
            data.releaseDate = new Date(data.releaseDate);
        }
        plugins.push(data);
    }
    return plugins;
}
/**
 * Remove all files and directories from build directory.
 */
async function cleanBuildDir() {
    const buildDir = getConfig('BUILD_PATH');
    await promises_1.default.rm(buildDir, { force: true, recursive: true });
    return promises_1.default.mkdir(buildDir);
}
/**
 * Remove all files and directories from development directory.
 */
async function cleanDevDir() {
    const buildDir = getConfig('DEVELOPMENT_PATH');
    await promises_1.default.rm(buildDir, { force: true, recursive: true });
    return promises_1.default.mkdir(buildDir);
}
/**
 * Remove all files and directories from installed directory.
 */
async function cleanInstallDir() {
    const buildDir = getConfig('INSTALL_PATH');
    await promises_1.default.rm(buildDir, { force: true, recursive: true });
    return promises_1.default.mkdir(buildDir);
}
/**
 * Build a tar package of the plugin from the given directories.
 * @param plugin JSON data of the plugin.
 * @param uiPath Path to the UI part.
 * @param backendPath Path to the backebd part.
 * @returns Tar path.
 */
async function buildPlugin(plugin, uiPath, backendPath) {
    const tarPath = path_1.default.join(getConfig('BUILD_PATH'), `${plugin.code}-${plugin.version}.tgz`);
    await promises_1.default.mkdir(path_1.default.join(getConfig('BUILD_PATH'), plugin.code), { recursive: true });
    await promises_1.default.writeFile(path_1.default.join(getConfig('BUILD_PATH'), plugin.code, 'plugin.json'), JSON.stringify(plugin, null, 2));
    if (plugin.use !== 'ui') {
        if (!backendPath) {
            throw new Error('No backend path given.');
        }
        await promises_1.default.mkdir(path_1.default.join(getConfig('BUILD_PATH'), plugin.code, 'backend'), { recursive: true });
        for (const file of glob_1.default.sync(path_1.default.join(backendPath, '*'))) {
            await promises_1.default.copyFile(file, path_1.default.join(getConfig('BUILD_PATH'), plugin.code, 'backend', path_1.default.basename(file)));
        }
    }
    if (plugin.use !== 'backend') {
        if (!uiPath) {
            throw new Error('No UI path given.');
        }
        await promises_1.default.mkdir(path_1.default.join(getConfig('BUILD_PATH'), plugin.code, 'ui'), { recursive: true });
        for (const file of glob_1.default.sync(path_1.default.join(uiPath, '*'))) {
            await promises_1.default.copyFile(file, path_1.default.join(getConfig('BUILD_PATH'), plugin.code, 'ui', path_1.default.basename(file)));
        }
    }
    await tar_1.default.c({ gzip: true, cwd: getConfig('BUILD_PATH'), file: tarPath }, ['./' + plugin.code]);
    return tarPath;
}
/**
 * Publish a plugin to ERP.
 * @param plugin
 * @param tarPath
 * @returns
 */
async function publishPlugin(plugin, tarPath) {
    plugin.releaseDate = new Date();
    plugin.package = fs_1.default.readFileSync(tarPath).toString('base64');
    return tasenor_common_1.ERP_API.call('POST', '/plugins/publish', plugin);
}
/**
 * Collection of file system and API related plugin handling functions for fetching, building and scanning.
 */
exports.plugins = {
    buildPlugin,
    cleanBuildDir,
    cleanDevDir,
    cleanInstallDir,
    findPluginFromIndex,
    fetchOfficialPluginList,
    getConfig,
    loadPluginIndex,
    publishPlugin,
    samePlugins,
    scanBackendPlugins,
    scanInstalledPlugins,
    scanUIPlugins,
    setConfig,
    sortPlugins
};
//# sourceMappingURL=plugins.js.map