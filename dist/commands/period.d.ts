import { PeriodModelData } from '@dataplug/tasenor-common';
import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
declare class PeriodCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): any;
    print(data: PeriodModelData[]): void;
    rm(): any;
    create(): any;
    run(): any;
}
export default PeriodCommand;
