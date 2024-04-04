import { NextResponse, type NextRequest } from 'next/server';
import { type Test } from './lib/types/tests';
import { parseValue } from './lib/utils/parse-value';
import { findTest } from './lib/find-test';
import { COOKIE_NAME } from './lib/data/cookies';

export const createMiddleware = (tests: Test[]) => (request: NextRequest) => {
    const pathname = request.nextUrl.pathname;
    const prevTestCookieRow = request.cookies.get(COOKIE_NAME)?.value;

    if (prevTestCookieRow === '0') return NextResponse.next();

    const prevTestCookie = parseValue(prevTestCookieRow);
    const testResult = findTest(tests, request, prevTestCookie);

    if (testResult) {
        const { id, variantIndex, destination } = testResult;
        const next = NextResponse.rewrite(new URL(destination, request.url));
        next.cookies.set(COOKIE_NAME, JSON.stringify({ id, variantIndex }));
        return next;
    }

    const next = NextResponse.next();

    // Protection from the participation of the script for the page for non-participating users, since the script has the same path as the page itself
    next.cookies.set(COOKIE_NAME, '0', { path: pathname, expires: 0, maxAge: 0 });
    return next;
}
