import { AccountModelData } from '@dataplug/tasenor-common';
import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
declare class AccountCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): Promise<void>;
    print(data: AccountModelData[]): void;
    rm(): Promise<void>;
    create(): Promise<void>;
    run(): Promise<void>;
}
export default AccountCommand;
