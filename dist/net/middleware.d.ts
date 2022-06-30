import { RequestHandler, ErrorRequestHandler } from 'express';
import { TokenAudience, Url } from '@dataplug/tasenor-common';
/**
 * Hide tokens from URL.
 * @param url
 */
export declare function cleanUrl(url: string): string;
/**
 * A parameter definition to the initial middleware stack.
 */
export interface InitialMiddlewareStackDefinition {
    origin: Url | '*';
    api?: Url;
}
/**
 * Construct standard initial part of stack of commonly shared middlewares.
 */
export declare function tasenorInitialStack(args: InitialMiddlewareStackDefinition): RequestHandler[];
/**
 * Construct standard final part of stack of commonly shared middlewares.
 */
export declare function tasenorFinalStack(): (ErrorRequestHandler | RequestHandler)[];
/**
 * A parameter defintion for construcing standard middleware stack.
 */
export interface MiddlewareStackDefinition {
    url?: boolean;
    json?: boolean;
    user?: boolean;
    admin?: boolean;
    superuser?: boolean;
    token?: boolean;
    uuid?: boolean;
    audience?: TokenAudience | TokenAudience[];
    upload?: boolean;
}
/**
 * A constructor for tasenor middleware stack based on the arguments.
 *
 * Each flag adds one or more functions to the stack returned.
 *
 * Flags:
 * - `url` Urlenconder parser.
 * - `json` JSON body parser.
 * - `token` Look for token from the request, but do not verify it yet.
 * - `user` Check that user token is present and for bookkeeper.
 * - `uuid` Check that UUID header is present and parse owner from the token. Verify signature of the token for ANY audience.
 * - `admin` Check that the valid bookkeeper user token exists and has admin feat.
 * - `superuser` Check that the valid bookkeeper user token exists and has superuser feat.
 * - `audience` The token audience to check token against (user or admin implies 'bookkeeper' unless explicitly given).
 * - `upload` If set, allow much bigger body for request.
 *
 * The output on the res.locals is:
 *
 * - `token` Raw token string.
 * - `auth` Content of the token if verified.
 * - `user` Name of the owner of the token if verified,
 * - `uuid` If X-UUID header was found, the value of it.
 * - `owner` Set when UUID is found and token signed for ANY audience.
 */
export declare function tasenorStack({ url, json, user, uuid, admin, superuser, audience, token, upload }: MiddlewareStackDefinition): RequestHandler[];
