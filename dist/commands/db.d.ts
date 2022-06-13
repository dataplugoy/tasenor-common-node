import { DatabaseModelData } from '@dataplug/tasenor-common';
import { ArgumentParser } from 'argparse';
import { Command } from '../cli';
declare class DbCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): Promise<void>;
    print(data: DatabaseModelData[]): void;
    rm(): Promise<void>;
    create(): Promise<void>;
    upload(): Promise<void>;
    run(): Promise<void>;
}
export default DbCommand;
