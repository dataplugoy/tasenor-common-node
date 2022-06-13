import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
declare class SettingsCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): any;
    print(data: any): void;
    set(): any;
    run(): any;
}
export default SettingsCommand;
