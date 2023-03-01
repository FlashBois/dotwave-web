<script>
	import ImageLoader from '$components/Image/ImageLoader.svelte';
</script>

<div>
	<input type="checkbox" id="darkmode-toggle" />
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
	label {
		width: 500px;
		height: 200px;
		position: relative;
		display: block;
		background: #242424;
		border-radius: 200px;
		box-shadow: inset 0px 5px 15px rgba(0, 0, 0, 0.4), inset 0px -5px 15px rgba(255, 255, 255, 0.4);
		cursor: pointer;
	}

	label:after {
		content: '';
		width: 180px;
		height: 180px;
		position: absolute;
		top: 10px;
		left: 10px;
        background: linear-gradient(180deg, #777, #3a3a3a);
		border-radius: 180px;
		box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
	}
	input {
		width: 0;
		height: 0;
		visibility: hidden;
	}
	input:checked + label {
		background: #242424;
	}
	input:checked + label:after {
		left: 490px;
		transform: translateX(-100%);
		background: linear-gradient(180deg, #777, #3a3a3a);
	}
	label,
	label:after {
		transition: 0.3s;
	}

	label:active:after {
		width: 260px;
	}

	label img {
		position: absolute;
		width: 120px;
		top: 40px;
		z-index: 100;
	}
	label img.sun {
		left: 40px;
		fill: #fff;
		transition: 0.3s;
	}
	label img.moon {
		left: 340px;
		fill: #7e7e7e;
		transition: 0.3s;
	}
	input:checked + label svg.sun {
		fill: #7e7e7e;
	}
	input:checked + label svg.moon {
		fill: #fff;
	}
</style>
