import { TokenPayload, Secret, TokenAudience, Token, TokenPair } from '@dataplug/tasenor-common';
/**
 * Find a token from the request if available.
 * @param request A HTTP request.
 */
declare function get(request: any): Token | undefined;
/**
 * Sign the payload with the given secret.
 * @param payload
 * @param expires
 * @returns A JSON web token.
 */
declare function sign(payload: TokenPayload, audience: TokenAudience, expires?: number): Promise<Token>;
/**
 * Sign both the normal token and refresh token for it.
 * @param payload
 * @param audience
 * @param expires
 */
declare function sign2(payload: TokenPayload, audience: TokenAudience, expires?: number): Promise<TokenPair>;
/**
 * Check the token validity.
 * @param token
 * @param secret
 * @param quiet If set, do not trigger errors.
 * @returns Token payload if valid.
 */
declare function verify(token: Token, secret: Secret, audience: TokenAudience | TokenAudience[], quiet?: boolean): TokenPayload | null;
/**
 * Parse the payload of the token without verifying.
 * @param token
 */
declare function parse(token: Token): {
    [key: string]: any;
} | null;
/**
 * A checker for token validity.
 * @param token
 * @param audience
 * @param quiet If set, do not trigger errors.
 */
declare function check(token: Token, audience: TokenAudience, quiet?: boolean): Promise<boolean>;
export declare const tokens: {
    check: typeof check;
    get: typeof get;
    parse: typeof parse;
    sign: typeof sign;
    sign2: typeof sign2;
    verify: typeof verify;
};
export {};
