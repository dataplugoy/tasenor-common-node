import { AccountModelData } from '@dataplug/tasenor-common';
import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
declare class AccountCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): any;
    print(data: AccountModelData[]): void;
    rm(): any;
    create(): any;
    run(): any;
}
export default AccountCommand;
