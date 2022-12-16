import { KnexDatabase } from '../database';
import { BackendPlugin } from './BackendPlugin';
/**
 * A generic tool.
 */
export declare class ToolPlugin extends BackendPlugin {
    /**
     * Handler for GET request.
     */
    GET(db: KnexDatabase, query: any): Promise<unknown>;
    /**
     * Handler for DELETE request.
     */
    DELETE(db: KnexDatabase, query: any): Promise<unknown>;
    /**
     * Handler for POST request.
     */
    POST(db: KnexDatabase, data: any): Promise<unknown>;
    /**
     * Handler for PUT request.
     */
    PUT(db: KnexDatabase, data: any): Promise<unknown>;
    /**
     * Handler for PATCH request.
     */
    PATCH(db: KnexDatabase, data: any): Promise<unknown>;
}
