import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
declare class SettingsCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): Promise<void>;
    print(data: any): void;
    set(): Promise<void>;
    run(): Promise<void>;
}
export default SettingsCommand;
