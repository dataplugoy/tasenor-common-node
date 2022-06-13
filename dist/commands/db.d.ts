import { DatabaseModelData } from '@dataplug/tasenor-common';
import { ArgumentParser } from 'argparse';
import { Command } from '../cli';
declare class DbCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): any;
    print(data: DatabaseModelData[]): void;
    rm(): any;
    create(): any;
    upload(): any;
    run(): any;
}
export default DbCommand;
