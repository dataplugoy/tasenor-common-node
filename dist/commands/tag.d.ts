import { TagModelData } from '@dataplug/tasenor-common';
import { Command } from '../cli';
import { ArgumentParser } from 'argparse';
declare class TagCommand extends Command {
    addArguments(parser: ArgumentParser): void;
    ls(): any;
    print(data: TagModelData[]): void;
    rm(): any;
    download(): any;
    create(): any;
    run(): any;
}
export default TagCommand;
