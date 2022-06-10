"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTransactionImportConnector = void 0;
function isTransactionImportConnector(o) {
    if (typeof o !== 'object' || o === null) {
        return false;
    }
    let f = o.getRate;
    if (typeof f !== 'function') {
        return false;
    }
    f = o.getStock;
    if (typeof f !== 'function') {
        return false;
    }
    f = o.initializeBalances;
    if (typeof f !== 'function') {
        return false;
    }
    f = o.getAccounts;
    if (typeof f !== 'function') {
        return false;
    }
    f = o.getVAT;
    if (typeof f !== 'function') {
        return false;
    }
    return true;
}
exports.isTransactionImportConnector = isTransactionImportConnector;
//# sourceMappingURL=TransactionImportConnector.js.map