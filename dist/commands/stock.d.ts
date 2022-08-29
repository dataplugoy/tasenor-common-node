import { Command } from '.';
import { ArgumentParser } from 'argparse';
declare class StockCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    create(): Promise<void>;
    run(): Promise<void>;
}
export default StockCommand;
