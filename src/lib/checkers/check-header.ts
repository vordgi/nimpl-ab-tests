import { headers } from 'next/headers';
import { type Rule } from '../types/tests';

export const checkHeader = (_url: URL, rule: Rule) => {
    if (!rule.value) return { match: headers().has(rule.key), groups: {} };

    const value = headers().get(rule.key);
    const match = value?.match(`^${rule.value}$`);

    if (match) return { match: true, groups: match.groups || {} };

    return { match: false, groups: {} };
}
