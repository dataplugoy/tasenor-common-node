import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
import { TasenorPlugin } from '@dataplug/tasenor-common';
declare class PluginCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    print(data: TasenorPlugin[]): void;
    ls(): any;
    install(): any;
    run(): any;
}
export default PluginCommand;
