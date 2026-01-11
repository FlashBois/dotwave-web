<script lang="ts">
    export let percent: number
</script>

<div class="progress-bar">
    <div class="progress-bar__center" style={`width: ${percent}%`}></div>
</div>

<style lang="scss">
	.progress-bar {
		margin: auto;
		width: 80px;
		max-width: 80%;
		height: 7px;
		border: 1px solid #5b5b5b;
		border-radius: 20px;
		position: relative;
		overflow: hidden;
	}

	.progress-bar__center {
		height: 100%;
		animation: progress-anime 3s ease-out infinite;
		background: #66b328;
	}
</style>
