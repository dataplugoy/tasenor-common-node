import { TagModelData } from '@dataplug/tasenor-common';
import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
declare class TagCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): Promise<void>;
    print(data: TagModelData[]): void;
    rm(): Promise<void>;
    download(): Promise<void>;
    create(): Promise<void>;
    run(): Promise<void>;
}
export default TagCommand;
