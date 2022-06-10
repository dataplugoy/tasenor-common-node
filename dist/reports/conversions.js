"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.data2csv = void 0;
const json2csv_1 = __importDefault(require("json2csv"));
const sprintf_js_1 = require("sprintf-js");
/**
 * Convert report to CSV format.
 * @param {Object} report
 * @param {Object} options
 * @param {String} options.lang Localize number using this language.
 */
function data2csv(report, options) {
    const csv = [];
    const render = {
        id: (column, entry) => entry.id,
        name: (column, entry) => `${entry.isAccount ? entry.number + ' ' : ''}${entry.name}`,
        text: (column, entry) => entry[column.name],
        numeric: (column, entry) => (entry.amounts &&
            !entry.hideTotal &&
            entry.amounts[column.name] !== '' &&
            !isNaN(entry.amounts[column.name]) &&
            entry.amounts[column.name] !== undefined)
            ? (entry.amounts[column.name] === null ? '—' : (0, sprintf_js_1.sprintf)('%.2f', entry.amounts[column.name] / 100))
            : ''
    };
    const { data, columns } = report;
    let line = {};
    if (!options.dropTitle) {
        columns.forEach((column) => (line[column.name] = column.title));
        csv.push(line);
    }
    data.forEach((entry) => {
        if (entry.paragraphBreak) {
            return;
        }
        line = {};
        columns.forEach((column) => {
            if (entry.pageBreak || entry.paragraphBreak) {
                line[column.name] = '';
            }
            else {
                line[column.name] = render[column.type](column, entry);
            }
        });
        csv.push(line);
    });
    const fields = columns.map((c) => c.name);
    return json2csv_1.default.parse(csv, { fields, header: false });
}
exports.data2csv = data2csv;
//# sourceMappingURL=conversions.js.map