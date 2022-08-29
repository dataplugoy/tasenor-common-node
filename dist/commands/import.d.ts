import { Command } from '.';
import { ArgumentParser } from 'argparse';
import { ProcessModelData } from 'interactive-elements';
declare type ProcessPostResponse = {
    processId: number;
    step: number;
    status: string;
};
declare class ImportCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): Promise<void>;
    create(): Promise<void>;
    print(data: ProcessModelData[] | ProcessPostResponse): void;
    run(): Promise<void>;
}
export default ImportCommand;
