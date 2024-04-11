import { type Variant } from "../types/tests";

export const rollTest = (variants: Variant[]) => {
    const roll = Math.random();
    let sum = 0;

    for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        sum += variant.weight;
        if (roll <= sum) {
            return i;
        }
    }
};
