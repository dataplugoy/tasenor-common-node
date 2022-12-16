import { BackendPlugin } from './BackendPlugin';
/**
 * A generic tool.
 */
export declare class ToolPlugin extends BackendPlugin {
    GET(query: any): Promise<unknown>;
    DELETE(query: any): Promise<unknown>;
    POST(data: any): Promise<unknown>;
    PUT(data: any): Promise<unknown>;
    PATCH(data: any): Promise<unknown>;
}
