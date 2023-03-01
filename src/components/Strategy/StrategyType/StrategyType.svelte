<script lang="ts">
    export let strategy: {
        hasLend: boolean;
        hasSwap: boolean;
        hasTrade: boolean;
    }

    const types = ['Lend', 'Swap', 'Trade']
    const createdStrategy = types.filter(item => {
        if(strategy.hasLend && item == 'Lend') return true
        if(strategy.hasSwap && item == 'Swap') return true
        if(strategy.hasTrade && item == 'Trade') return true
        return false
    })
</script>

<div>
    {#each createdStrategy as item, i}
        {item} {#if createdStrategy.length - 1 > i} - {/if}
    {/each}
</div>