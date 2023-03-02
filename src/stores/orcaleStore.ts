import { writable } from 'svelte/store';

export const oracle = writable<Map<string, number>>(new Map())