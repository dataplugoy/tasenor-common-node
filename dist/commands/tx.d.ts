import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
import { DocumentModelData } from '@dataplug/tasenor-common';
declare class TxCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): any;
    print(data: DocumentModelData[]): void;
    rm(): any;
    create(): any;
    run(): any;
}
export default TxCommand;
