import { type Test } from "./tests";

export type CookieOptions = {
    /**
     * Add maxAge attribute for ab-tests cookie
     *
     * default: `undefined` (session)
     */
    maxAge?: number;
    /**
     * Add httpOnly flag for ab-tests cookie
     *
     * default: `true`
     */
    httpOnly?: boolean;
    /**
     * Priority attribute for ab-tests cookie
     *
     * default: `medium`
     */
    priority?: "medium" | "low" | "high";
    /**
     * Add sameSite attribute for ab-tests cookie
     * default: `strict`
     */
    sameSite?: boolean | "strict" | "lax" | "none";
    /**
     * Add secure flag for ab-tests cookie
     *
     * default: `true`
     */
    secure?: boolean;
    /** Domain attribute value for ab-tests cookie */
    domain?: string;
    /** path attribute value for ab-tests cookie */
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
    cookieConfiguration: CookieConfiguration;
};
