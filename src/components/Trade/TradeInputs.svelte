<script lang="ts">
	import Input from '$components/Inputs/Input/Input.svelte';
	export let pnl: number = 0;
</script>

<div class="inputs">
	<div class="input-box">
		<span> Short </span>

		<Input />
	</div>

	<div class="input-box pnl-box">
		<span>&nbsp;</span>
		<div class="pnl {pnl > 0 ? 'profit' : ''} {pnl < 0 ? 'loss' : ''}">{pnl ?? '-'}</div>
	</div>

	<div class="input-box">
		<span> Long </span>
		<Input />
	</div>
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

		.input-box {
			width: 100%;
			border-radius: 10px;
			border: none;
			backdrop-filter: none;

			span {
				font-size: 1.7rem;
				color: var(--color-primary-white);
			}

			.input {
				width: 100%;
				border-radius: 10px;
				backdrop-filter: blur(50px);
			}
		}

		.pnl-box {
			width: 30%;
		}

		.pnl {
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
