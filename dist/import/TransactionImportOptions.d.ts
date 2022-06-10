import { ImportCSVOptions } from 'interactive-elements';
export interface TransactionImportOptions {
    parser: 'csv' | 'custom';
    numericFields: string[];
    requiredFields: string[];
    csv?: ImportCSVOptions;
}
