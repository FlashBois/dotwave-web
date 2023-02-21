<script lang="ts">
	import { createEventDispatcher } from "svelte";

    export let placeholder: string = ''
    export let value: string = ''

    const dispatch = createEventDispatcher();
	const onInputChange = () => {
		dispatch('inputChange', {
			value
		});
	};
</script>

<div class="search-input">
    <input type="text" bind:value on:input={onInputChange} placeholder={placeholder}>
</div>