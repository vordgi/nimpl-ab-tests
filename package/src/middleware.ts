import { NextResponse, type NextRequest } from "next/server";
import { type CookieOptions, type CreateMiddlewareOptions } from "./lib/types/middleware";
import { parseValue } from "./lib/utils/parse-value";
import { findTest } from "./lib/find-test";
import { COOKIE_NAME } from "./lib/data/cookies";

export const createMiddleware =
    ({ tests, cookieConfiguration }: CreateMiddlewareOptions) =>
    (request: NextRequest) => {
        const pathname = request.nextUrl.pathname;
        const testCookieRow = request.cookies.get(COOKIE_NAME)?.value;

        const prevTestCookie = parseValue(testCookieRow);
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
                maxAge,
            } = cookieConfiguration;

            const cookieOptions: CookieOptions = {
                maxAge,
                httpOnly,
                priority,
                sameSite,
                secure,
            };

            if (domain) {
                const reqDomain = request.headers.get("host") || request.headers.get("x-forwarded-host");
                if (reqDomain) {
                    cookieOptions.domain = reqDomain;
                } else {
                    console.error("ab-tests: Unable to obtain host for target request");
                }
            }
            if (path) cookieOptions.path = pathname;

            next.cookies.set(COOKIE_NAME, JSON.stringify({ id, variantIndex }), cookieOptions);

            return next;
        }
    };
