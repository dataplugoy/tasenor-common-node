import { Router } from 'express';
import { KnexDatabase } from '../database';
import { ProcessingConfigurator } from './types';
export declare function router<VendorElement, VendorState, VendorAction>(db: KnexDatabase, configurator: ProcessingConfigurator<VendorElement, VendorState, VendorAction>): Router;
