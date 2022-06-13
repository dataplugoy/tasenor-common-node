import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
declare class UserCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): Promise<void>;
    print(data: any): void;
    rm(): Promise<void>;
    create(): Promise<void>;
    add(): Promise<void>;
    run(): Promise<void>;
}
export default UserCommand;
