import { ImportAction, TasenorElement } from '@dataplug/tasenor-common';
/**
 * Definition of the how the direction plays out.
 */
export declare type DirectionsType = 'action' | 'ui' | 'complete';
/**
 * Definition of direction data.
 */
export interface DirectionsData {
    type: DirectionsType;
    element?: TasenorElement;
    action?: ImportAction;
}
/**
 * Data describing possible directions forward from the given state.
 */
export declare class Directions {
    type: DirectionsType;
    element?: TasenorElement;
    action?: ImportAction;
    constructor(obj: DirectionsData);
    /**
     * Construct JSON data of the member fields that has been set.
     * @returns
     */
    toJSON(): DirectionsData;
    /**
     * Check if the direction can be determined without user intervention.
     */
    isImmediate(): boolean;
    /**
     * Check if there are no directions forward.
     */
    isComplete(): boolean;
}
