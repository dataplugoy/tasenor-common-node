import { ImportCSVOptions } from 'interactive-elements';
export interface TransactionImportOptions {
    parser: 'csv' | 'custom';
    numericFields: string[];
    requiredFields: string[];
    totalAmountField: string | null;
    textField: string | null;
    csv?: ImportCSVOptions;
}
