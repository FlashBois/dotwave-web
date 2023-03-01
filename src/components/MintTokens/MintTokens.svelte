<script lang="ts">
	import GradientButton from "$components/Buttons/GradientButton/GradientButton.svelte";
	import { walletStore } from "$src/stores/walletStore";
	import { web3Store } from "$src/stores/web3Store";
	import { useMintDevnetTokens } from "$src/tools/web3/useMintDevnetTokens";
	import { get } from "svelte/store";

    async function onButtonClick(){
        const { connection } = get(web3Store)
        const wallet = get(walletStore)
        if(wallet){
            await useMintDevnetTokens(connection, wallet)
        }
    }
</script>

<div class="mint-tokens-box">
    <GradientButton on:click={onButtonClick}>Mint Tokens</GradientButton>
</div>