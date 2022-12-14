import { Request, Router } from 'express';
import { KnexDatabase } from '../database';
import { ProcessingSystem } from '../process';
export type ProcessingConfigurator = (req: Request) => ProcessingSystem;
export declare function router(db: KnexDatabase, configurator: ProcessingConfigurator): Router;
