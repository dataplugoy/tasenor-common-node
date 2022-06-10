import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
import { EntryModelData } from '@dataplug/tasenor-common';
declare class EntryCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    filter(): Promise<EntryModelData[]>;
    ls(): Promise<void>;
    print(data: EntryModelData[]): void;
    edit(): Promise<void>;
    run(): Promise<void>;
}
export default EntryCommand;
