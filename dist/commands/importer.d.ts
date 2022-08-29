import { ImporterModelData } from '@dataplug/tasenor-common';
import { Command } from '.';
import { ArgumentParser } from 'argparse';
declare class ImporterCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): Promise<void>;
    print(data: ImporterModelData[]): void;
    create(): Promise<void>;
    set(): Promise<void>;
    config(): Promise<void>;
    run(): Promise<void>;
}
export default ImporterCommand;
