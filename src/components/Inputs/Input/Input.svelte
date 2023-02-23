<script lang="ts">
    export let placeholder: string = '0'
    export let value: number = 0
</script>

<div class="input-box">
    <input type="text" bind:value placeholder={placeholder}>
</div>