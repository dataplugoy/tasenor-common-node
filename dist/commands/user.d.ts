import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
declare class UserCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): any;
    print(data: any): void;
    rm(): any;
    create(): any;
    add(): any;
    run(): any;
}
export default UserCommand;
