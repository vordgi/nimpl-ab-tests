import { type Rule } from '../types/tests';

export const checkQuery = (url: URL, rule: Rule) => {
    if (!rule.value) return { match: url.searchParams.has(rule.key), groups: {} };

    const match = url.searchParams.get(rule.key)?.match(`^${rule.value}$`);

    if (match) return { match: true, groups: match.groups || {} };

    return { match: false, groups: {} };
}
