import { type Rule } from "../types/tests";

export const checkHost = (url: URL, rule: Rule) => {
    if (!rule.value) return { match: true, groups: {} };

    const match = url.host.match(`^${rule.value}$`);

    if (match) return { match: true, groups: match.groups || {} };

    return { match: false, groups: {} };
};
