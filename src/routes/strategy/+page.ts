import { loadStrategies } from '$src/stores/strategyStore';

/** @type {import('./$types').PageLoad} */
export async function load() {
	await loadStrategies()
}
