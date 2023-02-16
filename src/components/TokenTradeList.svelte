<script lang="ts">
	import Fuse from 'fuse.js';

	export let value = '';
	export let listData: { symbol: string; price: number; change: number }[] = [];

	let tokenList: { symbol: string; price: number; change: number }[] = listData;

	const options = {
		includeScore: true,
		keys: ['symbol']
	};

	const fuse = new Fuse(listData, options);

	function onSearchChange() {
		const result = fuse.search(value);

		tokenList = result.map((e) => {
			return {
				symbol: e.item.symbol,
				price: e.item.price,
				change: e.item.change
			};
		});
	}
</script>

<div class="trade-token-list">
	<div class="trade-token-list__search">
		<input
			class="trade-token-list__input"
			bind:value
			placeholder="Search symbol"
			on:input={onSearchChange}
		/>
	</div>
	<div class="trade-token-list__box">
		<table class="trade-token-list__table">
			<thead>
				<tr class="trade-token-list__head">
					<th class="trade-token-list__cell--symbol">Symbol</th>
					<th class="trade-token-list__cell--price">Price</th>
					<th class="trade-token-list__cell--change">Change</th>
				</tr>
			</thead>
			<tbody>
				{#each listData as { symbol, price, change }, i}
						<tr class="trade-token-list__row">
							<td class="trade-token-list__cell--symbol">{symbol}</td>
							<td class="trade-token-list__cell--price">{price}</td>

							{#if change > 0}
								<td class="trade-token-list__cell--change trade-token-list__cell--plus">{change}</td>
							{:else if change == 0}
								<td class="trade-token-list__cell--change trade-token-list__cell--neutral">{change}</td>
							{:else}
								<td class="trade-token-list__cell--change trade-token-list__cell--minus">{change}</td>
							{/if}
						</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
