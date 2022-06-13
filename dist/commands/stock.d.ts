import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
declare class StockCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    create(): any;
    run(): any;
}
export default StockCommand;
