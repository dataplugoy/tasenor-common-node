import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
import { AccountNumber } from '@dataplug/tasenor-common';
declare class BalanceCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): Promise<void>;
    print(data: Record<AccountNumber, number>): void;
    create(): Promise<void>;
    run(): Promise<void>;
}
export default BalanceCommand;
