<script>
	import StrategyTable from '$components/Strategy/Table/Table.svelte';
	import { loadStrategies } from '$src/stores/strategyStore';
	import { onMount } from 'svelte';

	onMount(async () => {
		await loadStrategies();
	});
</script>

<svelte:head><title>Strategy</title></svelte:head>

<div class="strategy-page">
	<div class="filters-section" />
	<div class="strategy-table-section">
		<StrategyTable />
	</div>
</div>
