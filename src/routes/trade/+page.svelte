<script lang="ts">
	import Lightweight from '$components/Lightweight/Lightweight.svelte'
    import TokenTradeList from '$components/TokenTradeList.svelte';
	import { tokenListStore } from '$src/stores/tokenListStore';
</script>

<div class="trade-page">
    <!-- STATISTICS -->
    <div class="statistics-section">

    </div>

    <!-- TOKEN LIST -->
    <div class="token-list-section">
        <TokenTradeList listData={$tokenListStore}/>
    </div>

    <!-- CHART -->
    <div class="lightweight-section">
        <Lightweight/>
    </div>

    <!-- BUY / SELL -->
    <div class="buy-sell-section">

    </div>

    <!-- POSITIONS LIST -->
    <div class="positions-section">

    </div>
</div>
