import { BackendPlugin } from './BackendPlugin'

/**
 * A generic tool.
 */
export class ToolPlugin extends BackendPlugin {

  /**
   * Handler for GET request.
   */
  async GET(query): Promise<unknown> {
    return undefined
  }

  /**
   * Handler for DELETE request.
   */
  async DELETE(query): Promise<unknown> {
    return undefined
  }

  /**
   * Handler for POST request.
   */
  async POST(data): Promise<unknown> {
    return undefined
  }

  /**
   * Handler for PUT request.
   */
  async PUT(data): Promise<unknown> {
    return undefined
  }

  /**
   * Handler for PATCH request.
   */
  async PATCH(data): Promise<unknown> {
    return undefined
  }
}
