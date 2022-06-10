import { PeriodModelData } from '@dataplug/tasenor-common';
import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
declare class PeriodCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): Promise<void>;
    print(data: PeriodModelData[]): void;
    rm(): Promise<void>;
    create(): Promise<void>;
    run(): Promise<void>;
}
export default PeriodCommand;
