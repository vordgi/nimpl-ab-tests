import { type NextRequest } from "next/server";
import { type Test } from "./types/tests";
import { rollTest } from "./utils/roll-test";
import { testRule } from "./utils/test-rule";

export const findTest = (tests: Test[], request: NextRequest, prevTest?: { id: string; variantIndex: number }) => {
    const targetPathname = request.nextUrl.pathname;

    let testData: {
        test: Test;
        groups: { [key: string]: string };
        isPrevTest: boolean;
    } | null = null;
    for (const test of tests) {
        const isPrevTest = test.id === prevTest?.id;
        const match = targetPathname.match(`^${test.source}$`);

        if (!match) continue;

        const groups = match.groups || {};

        if (test.has) {
            for (const rule of test.has) {
                if (isPrevTest && rule.ignoreOnNextRequests) continue;

                const { match, groups: ruleGroups } = testRule(request.nextUrl, rule);

                if (!match) break;

                Object.assign(groups, ruleGroups);
            }
        }

        if (test.missing) {
            for (const rule of test.missing) {
                if (isPrevTest && rule.ignoreOnNextRequests) continue;

                const { match, groups: ruleGroups } = testRule(request.nextUrl, rule);

                if (match) break;

                Object.assign(groups, ruleGroups);
            }
        }

        testData = { test, groups: match.groups || {}, isPrevTest };
        if (isPrevTest || !prevTest) {
            break;
        }
    }

    if (testData) {
        const { test, groups, isPrevTest } = testData;
        const variantIndex = prevTest && isPrevTest ? prevTest.variantIndex : rollTest(test.variants);

        if (typeof variantIndex !== "undefined") {
            const variant = test.variants[variantIndex];
            const formattedDestination = Object.entries(groups).reduce(
                (acc, [key, value]) => acc.replace(`:${key}`, value),
                variant.destination,
            );

            return {
                id: test.id,
                variantIndex,
                destination: formattedDestination,
                type: variant.type,
                status: variant.status,
            };
        }
    }
};
