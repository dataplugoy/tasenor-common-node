import { Command } from '.';
import { ArgumentParser } from 'argparse';
import { DocumentModelData } from '@dataplug/tasenor-common';
declare class TxCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): Promise<void>;
    print(data: DocumentModelData[]): void;
    rm(): Promise<void>;
    create(): Promise<void>;
    run(): Promise<void>;
}
export default TxCommand;
