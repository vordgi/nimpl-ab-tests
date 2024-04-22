import { NextResponse, type NextRequest } from "next/server";
import { type CookieOptions, type CreateMiddlewareOptions } from "./lib/types/middleware";
import { parseValue } from "./lib/utils/parse-value";
import { findTest } from "./lib/find-test";
import { COOKIE_NAME, COOKIE_NAME_TMP } from "./lib/data/cookies";

export const createMiddleware =
    ({ tests, cookieLifeTime, cookieConfiguration }: CreateMiddlewareOptions) =>
    (request: NextRequest) => {
        const pathname = request.nextUrl.pathname;
        const testCookieRow = request.cookies.get(COOKIE_NAME)?.value;
        const testCookieTmpRow = request.cookies.get(COOKIE_NAME_TMP)?.value;
        const testCookieBase = testCookieRow || testCookieTmpRow;

        if (testCookieBase === "0") return NextResponse.next();

        const prevTestCookie = parseValue(testCookieBase);
        const testResult = findTest(tests, request, prevTestCookie);

        if (testResult) {
            const { id, variantIndex, destination, type = "rewrite", status } = testResult;
            let next: NextResponse<unknown>;
            if (type === "rewrite") {
                next = NextResponse.rewrite(new URL(destination, request.url), { status: status || 200 });
            } else {
                next = NextResponse.redirect(new URL(destination, request.url), { status: status || 307 });
            }

            const {
                domain = true,
                path = true,
                httpOnly = true,
                priority = "medium",
                sameSite = "strict",
                secure = true,
            } = cookieConfiguration;

            const cookieOption: CookieOptions = {
                httpOnly,
                priority,
                sameSite,
                secure,
            };

            if (domain) {
                const reqDomain = request.headers.get("host") || request.headers.get("x-forwarded-host");
                if (reqDomain) {
                    cookieOption.domain = reqDomain;
                } else {
                    console.error("ab-tests: Unable to obtain host for target request");
                }
            }
            if (path) cookieOption.path = pathname;
            // We save for the session so that files are uploaded for the same variant
            next.cookies.set(COOKIE_NAME, JSON.stringify({ id, variantIndex }), cookieOption);

            // If cookieLifeTime is specified - we save it in case of a session change, but if cookies have already been - it means that it is no longer necessary to add it
            if (cookieLifeTime && !testCookieBase) {
                next.cookies.set(COOKIE_NAME_TMP, JSON.stringify({ id, variantIndex }), {
                    maxAge: cookieLifeTime,
                    ...cookieOption,
                });
            }
            return next;
        }

        const next = NextResponse.next();

        // Protection from the participation of the script for the page for non-participating users, since the script has the same path as the page itself
        next.cookies.set(COOKIE_NAME, "0", { path: pathname });
        return next;
    };
