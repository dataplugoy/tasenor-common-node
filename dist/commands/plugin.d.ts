import { Command } from '.';
import { ArgumentParser } from 'argparse';
import { TasenorPlugin } from '@dataplug/tasenor-common';
declare class PluginCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    print(data: TasenorPlugin[]): void;
    ls(): Promise<void>;
    install(): Promise<void>;
    rm(): Promise<void>;
    rebuild(): Promise<void>;
    refresh(): Promise<void>;
    reset(): Promise<void>;
    run(): Promise<void>;
}
export default PluginCommand;
