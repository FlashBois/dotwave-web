import type { IStrategyTable } from "$src/stores/strategyStore";

export enum ISortable {
    DESC,
    ASC,
    NONE
}

export function useAdvancedSorting<T extends IStrategyTable>(array: Array<T>, property: keyof T, sortingType: ISortable) {
    const direction = sortingType == ISortable.DESC ? 1 : -1;
    const result = array.sort(function (a, b) {
        if (a[property] < b[property]) {
            return -1 * direction;
        } else if (a[property] > b[property]) {
            return 1 * direction;
        } else {
            return 0;
        }
    });

    return result
}