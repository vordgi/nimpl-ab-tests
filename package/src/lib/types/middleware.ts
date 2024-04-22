import { type Test } from "./tests";

export type CookieOptions = {
    /**
     * Add httpOnly flag for ab-tests cookies
     *
     * default: `true`
     */
    httpOnly?: boolean;
    /**
     * Priority attribute for ab-tests cookies
     *
     * default: `medium`
     */
    priority?: "medium" | "low" | "high";
    /**
     * Add sameSite attribute for ab-tests cookies
     * default: `strict`
     */
    sameSite?: boolean | "strict" | "lax" | "none";
    /**
     * Add secure flag for ab-tests cookies
     *
     * default: `true`
     */
    secure?: boolean;
    /** Domain attribute value for ab-tests cookies */
    domain?: string;
    /** path attribute value for ab-tests cookies */
    path?: string;
};

export interface CookieConfiguration extends Omit<CookieOptions, "domain" | "path"> {
    /**
     * Add Domain attribute automatically depending on the target request host
     *
     * default: `true`
     */
    domain: boolean;
    /**
     * Add Path attribute automatically depending on the target request path
     *
     * default: `true`
     */
    path: boolean;
}

export type CreateMiddlewareOptions = {
    tests: Test[];
    cookieLifeTime?: number;
    cookieConfiguration: CookieConfiguration;
};
