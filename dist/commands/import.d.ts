import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
import { ProcessModelData } from 'interactive-elements';
declare type ProcessPostResponse = {
    processId: number;
    step: number;
    status: string;
};
declare class ImportCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): any;
    create(): any;
    print(data: ProcessModelData[] | ProcessPostResponse): void;
    run(): any;
}
export default ImportCommand;
