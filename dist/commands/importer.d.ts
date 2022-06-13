import { ImporterModelData } from '@dataplug/tasenor-common';
import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
declare class ImporterCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): any;
    print(data: ImporterModelData[]): void;
    create(): any;
    set(): any;
    config(): any;
    run(): any;
}
export default ImporterCommand;
