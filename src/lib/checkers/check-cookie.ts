import { cookies } from "next/headers";
import { type Rule } from "../types/tests";

export const checkCookie = (_url: URL, rule: Rule) => {
    if (!rule.value) return { match: cookies().has(rule.key), groups: {} };

    const cookie = cookies().get(rule.key);
    const match = cookie?.value?.match(`^${rule.value}$`);

    if (match) return { match: true, groups: match.groups || {} };

    return { match: false, groups: {} };
};
