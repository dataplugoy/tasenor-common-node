"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerRoot = exports.setServerRoot = exports.isDevelopment = exports.nodeEnv = exports.isProduction = exports.systemPiped = exports.system = void 0;
/**
 * Server operating system related functions.
 *
 * @module tasenor-common-node/src/system
 */
const child_process_1 = require("child_process");
const tasenor_common_1 = require("@dataplug/tasenor-common");
/**
 * Helper to execute system command as a promise.
 * @param command A command.
 * @param quiet If set, do not output.
 * @returns Srandard output if successfully executed.
 */
async function system(command, quiet = false) {
    if (!quiet) {
        (0, tasenor_common_1.log)(`Running system command: ${command}`);
    }
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, { maxBuffer: 1024 * 1024 * 500 }, (err, stdout, stderr) => {
            if (err) {
                if (!quiet)
                    (0, tasenor_common_1.error)(err);
                return reject(err);
            }
            if (stderr && !quiet) {
                (0, tasenor_common_1.note)(`${stderr}`);
            }
            if (stdout && !quiet) {
                (0, tasenor_common_1.log)(`${stdout}`);
            }
            resolve(stdout);
        });
    });
}
exports.system = system;
/**
 * A system call showing real time output of stdout.
 * @param command
 * @param quiet
 * @returns
 */
async function systemPiped(command, quiet = false) {
    if (!quiet) {
        (0, tasenor_common_1.log)(`Running system command: ${command}`);
    }
    return new Promise((resolve, reject) => {
        let out = '';
        const proc = (0, child_process_1.spawn)(command, { shell: true });
        proc.stdout.on('data', (data) => {
            out += data;
            if (!quiet)
                process.stdout.write(data);
        });
        proc.stderr.on('data', (data) => {
            if (!quiet)
                process.stderr.write(data);
        });
        proc.on('close', (code) => {
            if (code) {
                reject(new Error(`Failed with code ${code}.`));
            }
            else {
                resolve(out);
            }
        });
    });
}
exports.systemPiped = systemPiped;
/**
 * Check if the current environment is not development environment.
 */
function isProduction() {
    return !isDevelopment();
}
exports.isProduction = isProduction;
/**
 * Check and return the operating environment.
 * @returns
 */
function nodeEnv() {
    const env = process.env.NODE_ENV || 'production';
    if (!['development', 'staging', 'production'].includes(env)) {
        throw new Error(`Invalid NODE_ENV ${env}.`);
    }
    return env;
}
exports.nodeEnv = nodeEnv;
/**
 * Check if the current environment is development environment.
 */
function isDevelopment() {
    return nodeEnv() === 'development';
}
exports.isDevelopment = isDevelopment;
/**
 * Set the global server root path.
 */
let serverRootPath;
function setServerRoot(path) {
    serverRootPath = path;
}
exports.setServerRoot = setServerRoot;
/**
 * Get the path to the root of the running server.
 * @returns
 */
function getServerRoot() {
    if (!serverRootPath) {
        throw new Error('Server root is not set.');
    }
    return serverRootPath;
}
exports.getServerRoot = getServerRoot;
//# sourceMappingURL=system.js.map