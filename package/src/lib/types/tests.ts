export type RuleType = "header" | "cookie" | "host" | "query";

export type Rule = {
    type: RuleType;
    key: string;
    value?: string;
    ignoreOnNextRequests?: boolean;
};

export type Variant = {
    weight: number;
    destination: string;
    type?: "rewrite" | "redirect";
    status?: number;
};

export type Test = {
    id: string;
    source: string;
    has?: Rule[];
    missing?: Rule[];
    variants: Variant[];
};
