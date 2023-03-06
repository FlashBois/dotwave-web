<script lang="ts">
	import Input from '$components/Inputs/Input/Input.svelte';
	export let pnl: number = 0;
</script>

<div class="inputs">
	<Input />
	<div class="pnl {pnl > 0 ? 'profit' : ''} {pnl < 0 ? 'loss' : ''}">{pnl ?? '-'}</div>
	<Input />
</div>

<style lang="scss">
	.inputs {
		position: relative;
		width: 80%;

		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		gap: 1rem;

		.input {
			width: 100%;
			// border: 1px solid var(--color-primary-green);
			border-radius: 10px;
			backdrop-filter: blur(50px);

			display: grid;
			grid-template-columns: 2fr 1fr;
		}

		.pnl {
			width: 20%;
			border: 1px solid var(--color-primary-green);
			border-radius: 10px;
			backdrop-filter: blur(50px);

			padding: 1rem;
			font-size: 1.7rem;
			color: var(--color-primary-white);
			border: 1px solid var(--color-primary-green);
		}

		.profit {
			color: var(--color-primary-green);
		}

		.loss {
			color: var(--color-primary-red);
		}
	}
</style>
