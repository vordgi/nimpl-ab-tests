import { type Rule } from "../types/tests";
import { checkers } from "../checkers";

export const testRule = (url: URL, rule: Rule) => {
    const tester = checkers[rule.type];

    if (tester) return tester(url, rule);

    return { match: false, groups: {} }
}
