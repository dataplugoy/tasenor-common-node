import { Process } from './Process';
import { Directions } from './directions';
import { KnexDatabase } from '../database';
import { ID, ImportAction, ImportState } from '@dataplug/tasenor-common';
/**
 * A basic information of the processing step.
 */
export interface ProcessStepData {
    processId?: ID;
    number: number;
    state: ImportState;
    handler: string;
    action?: ImportAction;
    directions?: Directions;
    started?: Date;
    finished?: Date;
}
/**
 * Data of the one step in the process including possible directions and action taken to the next step, if any.
 */
export declare class ProcessStep {
    process: Process;
    id: ID;
    processId: ID;
    number: number;
    state: ImportState;
    handler: string;
    started: Date | undefined;
    finished: Date | undefined;
    directions?: Directions;
    action?: ImportAction | undefined;
    constructor(obj: ProcessStepData);
    toString(): string;
    /**
     * Get a reference to the database.
     */
    get db(): KnexDatabase;
    /**
     * Save the process info to the database.
     */
    save(): Promise<ID>;
    /**
     * Get the loaded process information as JSON object.
     * @returns
     */
    toJSON(): ProcessStepData;
    /**
     * Set directions and update database.
     * @param db
     * @param directions
     */
    setDirections(db: KnexDatabase, directions: Directions): Promise<void>;
}
