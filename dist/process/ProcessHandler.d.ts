import { ProcessFile } from './ProcessFile';
import { ProcessStep } from './ProcessStep';
import { ProcessingSystem } from './ProcessingSystem';
import { Process } from './Process';
import { Directions } from './directions';
import { ImportAction, ImportState, ProcessConfig } from '@dataplug/tasenor-common';
/**
 * A handler taking care of moving between process states.
 */
export declare class ProcessHandler {
    system: ProcessingSystem;
    name: string;
    constructor(name: string);
    /**
     * Attach this handler to the processing system during the registration.
     * @param system
     */
    connect(system: ProcessingSystem): void;
    /**
     * Check if we are able to handle the given file.
     * @param file
     */
    canHandle(file: ProcessFile): boolean;
    /**
     * Check if we are able to append the given file to the process.
     * @param file
     */
    canAppend(file: ProcessFile): boolean;
    /**
     * Check if the state is either successful `true` or failed `false` or not yet complete `undefined`.
     * @param state
     */
    checkCompletion(state: ImportState): boolean | undefined;
    /**
     * Execute an action to the state in order to produce new state. Note that state is cloned and can be modified to be new state.
     * @param action
     * @param state
     * @param files
     */
    action(process: Process, action: ImportAction, state: ImportState, files: ProcessFile[]): Promise<ImportState>;
    /**
     * Construct intial state from the given data.
     * @param file
     */
    startingState(files: ProcessFile[]): ImportState;
    /**
     * Figure out possible directions from the given state.
     * @param state
     */
    getDirections(state: ImportState, config: ProcessConfig): Promise<Directions>;
    /**
     * See if it is possible rollback a step.
     * @param step
     */
    rollback(step: ProcessStep): Promise<boolean>;
}
/**
 * A collection of process handlers.
 */
export declare type ProcessHandlerMap = {
    [key: string]: ProcessHandler;
};
