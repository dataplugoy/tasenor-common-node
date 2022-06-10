"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPlugin = void 0;
const fs_1 = __importDefault(require("fs"));
const BackendPlugin_1 = require("./BackendPlugin");
/**
 * A plugin providing mainly some kind of possibly frequently updated data source services.
 * Data will be publicly available from API.
 */
class DataPlugin extends BackendPlugin_1.BackendPlugin {
    constructor(...sources) {
        super();
        this.sources = sources;
    }
    /**
     * Provide the public knowledge this plugin is providing.
     */
    async getKnowledge() {
        const result = {};
        for (const source of this.sources) {
            const filePath = this.filePath(`${source}.json`);
            const data = JSON.parse(fs_1.default.readFileSync(filePath).toString('utf-8'));
            Object.assign(result, { [source]: data });
        }
        return result;
    }
}
exports.DataPlugin = DataPlugin;
//# sourceMappingURL=DataPlugin.js.map