import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
import { Report } from '@dataplug/tasenor-common';
declare class ReportCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): Promise<void>;
    view(): Promise<void>;
    print(data: Record<string, unknown> | Report): void;
    run(): Promise<void>;
}
export default ReportCommand;
