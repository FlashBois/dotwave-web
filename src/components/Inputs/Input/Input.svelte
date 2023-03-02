<script lang="ts">
    export let placeholder: string = '0'
    export let value: number = 0

    let className: string = '';
	export { className as class };
</script>

<div class="input-box">
    <input class="{className}" on:change type="text" bind:value placeholder={placeholder}>
</div>