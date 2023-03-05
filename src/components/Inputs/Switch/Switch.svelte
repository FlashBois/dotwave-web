<script lang="ts">
	let checked: boolean;

	function onCheckboxChange(event: Event) {
		console.log(event.target)
	}
</script>

<div class="switch-background">
	<input type="checkbox" bind:checked on:change={onCheckboxChange} />
	<label for="darkmode-toggle">
		<img
			class="sun"
			alt="ray"
			src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png"
		/>
		<img
			class="moon"
			alt="ray"
			src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
		/>
	</label>
</div>

<style lang="scss">
	@mixin background-blur {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
		backdrop-filter: blur(50px);
		-webkit-backdrop-filter: blur(50px);
		border: 1px solid rgba(255, 255, 255, 0.18);
		box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
	}
	.switch-background {
		width: 84px;
		height: 70px;
	}
	label {
		width: 84px;
		height: 35px;
		position: relative;
		display: block;
		background: transparent;
		border-radius: 200px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		box-shadow: inset 0px 5px 15px rgba(0, 0, 0, 0.4), inset 0px -5px 15px rgba(255, 255, 255, 0.4);
		cursor: pointer;
	}

	label:after {
		content: '';
		width: 30px;
		height: 30px;
		position: absolute;
		top: 2px;
		left: 2px;
		background: #131212;
		border-radius: 180px;
		box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
	}
	input {
		width: 0;
		height: 0;
		visibility: hidden;
	}
	input:checked + label {
		background: #131212c9;
		box-shadow: inset 0px 5px 15px rgba(0, 0, 0, 0.4), inset 0px -1px 3px rgba(255, 255, 255, 0.4);
	}
	input:checked + label:after {
		left: 79px;
		transform: translateX(-100%);
		background: transparent;
	}
	label,
	label:after {
		transition: 0.3s;
	}

	label:active:after {
		width: 75px;
	}

	label img {
		position: absolute;
		width: 23px;
		top: 5.4px;
		z-index: 100;
	}
	label img.sun {
		left: 5.2px;
		fill: #fff;
		transition: 0.3s;
		transform: scale(1.1);
	}
	label img.moon {
		left: 51px;
		top: 3.5px;
		width: 25px;
		height: 25px;
		fill: #7e7e7e;
		transition: 0.3s;
		transform: scale(0.9);
	}
	input:checked + label img.moon {
		transform: scale(1.1);
	}
	input:checked + label img.sun {
		transform: scale(0.9);
	}
</style>
