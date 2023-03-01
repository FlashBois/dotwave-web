<script lang="ts">
	export let src: string;
	export let alt: string;

	import IntersectionObserver from './IntersectionObserver.svelte';
	import Image from './Image.svelte';

	let className: string = '';
	export { className as class };
</script>

<IntersectionObserver once={true} let:intersecting>
	{#if intersecting}
		<Image {alt} {src} class={className} />
	{/if}
</IntersectionObserver>
