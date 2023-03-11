<script lang="ts">
	import Loader from '$components/Loader/Loader.svelte';
	import { fade } from 'svelte/transition';
	import type { INotification } from './notificationsStore';
	export let notification: INotification;
</script>

<div class="notification" in:fade out:fade>
	{#if notification.type == 'success'}
		<div class="notification-content">
			<h2>Success borrow transaction</h2>
		</div>
	{:else}
		<div class="notification-content">
			<h2>Confirming borrow transaction</h2>
			<Loader />
		</div>
	{/if}
</div>

<style>
	.notification {
		display: flex;
		width: 300px;
		height: 100px;
		align-items: stretch;
		justify-content: space-between;
		margin: 2rem;
		background: #ffffff3a;
		color: #ffffff9d;
		border-radius: 6px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
		/* background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0)); */
		backdrop-filter: blur(200px);
		-webkit-backdrop-filter: blur(50px);
		border: 1px solid rgba(255, 255, 255, 0.18);
		box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
	}
	.notification-content {
		width: 100%;
		padding: 12px 6px 12px 12px;
		box-sizing: border-box;
		word-wrap: break-word;
	}
	.notification-content p {
		font-size: 14px;
		color: #a1a1a1;
		margin: 2px 0 0;
	}
</style>
