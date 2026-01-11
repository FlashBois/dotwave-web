<script lang="ts">
    export let placeholder: string = '0'
    export let value: number = 0
</script>

<div class="input-box">
    <input type="text" value={value} class:exchange__input--readonly={true} placeholder={placeholder} disabled>
</div>