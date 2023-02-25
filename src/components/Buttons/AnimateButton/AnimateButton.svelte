<script lang="ts">
	import { createEventDispatcher } from "svelte";

	let btn: HTMLDivElement;

	function onMouseMove(e: MouseEvent) {
		const x = e.pageX - btn.offsetLeft;
		const y = e.pageY - btn.offsetTop;

		btn.style.setProperty('--x', x + 'px');
		btn.style.setProperty('--y', y + 'px');
	}

    const dispatch = createEventDispatcher()
    function onButtonClick() {
        dispatch('onClick')
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	bind:this={btn}
	on:mousemove={(e) => {
		onMouseMove(e);
	}}
    on:click={onButtonClick}
	class="button"
>
	<div class="button__blur" />
	<p class="button__text"><slot/></p>
</div>
