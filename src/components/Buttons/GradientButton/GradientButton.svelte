<script lang="ts">
	export let disabled: boolean = false;

	let className: string = '';
	export { className as class };
</script>

<button class="gradient-btn {className}" {disabled} on:click>
	{#if $$slots['icon']}
		<slot name="icon" />
	{/if}
	<slot /></button
>
