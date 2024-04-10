export const parseValue = (value?: string) => {
    try {
        return value && JSON.parse(value);
    } catch {
        return undefined;
    }
};
