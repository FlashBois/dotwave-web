<script lang="ts">
	export let placeholder: string = '0.00';
	export let value: number;

	let className: string = '';
	export { className as class };

	function onInputChange(event: KeyboardEvent) {
		const key = event.key;
		const isPureDecimal = key.length > 1 || /^\d*\.?\d*$/.test(key);
		const isControlKey = event.ctrlKey || event.altKey;
		if (!isPureDecimal && !isControlKey) {
			event.preventDefault();
		}
	}
</script>

<div class="input-box">
	<input
		class={className}
		on:keydown={onInputChange}
		on:change
		on:input
		on:keyup
		type="text"
		bind:value
		{placeholder}
		pattern="^[0-9-]*[.,]?[0-9]$"
	/>
</div>
