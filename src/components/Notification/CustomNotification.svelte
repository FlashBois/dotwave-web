<script lang="ts">
	import Loader from '$components/Loader/Loader.svelte';
	import { fade } from 'svelte/transition';
	import type { INotification } from './notificationsStore';
	export let notification: INotification;
</script>

<div class="notification" in:fade out:fade>
	{#if notification.type == 'success'}
		<div class="notification-content">
			<div class="notification-content__title">
				<h2>{notification.text} confirmed</h2>
			</div>
			<div class="notification-content__context">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="#16df16e5"
					class="bi bi-check-circle-fill"
					viewBox="0 0 16 16"
				>
					<path
						d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
					/>
				</svg>
				<span>Open explorer: {notification.text}</span>
			</div>
		</div>
	{:else if notification.type == 'failed'}
		<div class="notification-content">
			<div class="notification-content__title">
				<h2>{notification.text} failed</h2>
			</div>
			<div class="notification-content__context">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="#ca2c2c"
					class="bi bi-x-circle-fill"
					viewBox="0 0 16 16"
				>
					<path
						d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
					/>
				</svg>
				<span>Open explorer: {notification.text}</span>
			</div>
		</div>
	{:else}
		<div class="notification-content">
			<div class="notification-content__title">
				<h2>Confirming transaction</h2>
			</div>
			<div class="notification-content__context">
				<Loader />
				<span>Open explorer: {notification.text}</span>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.notification {
		display: flex;
		width: 280px;
		height: 100px;
		align-items: stretch;
		justify-content: space-between;
		margin: 2rem;
		background: #2017178e;
		color: #ffffff9d;
		border-radius: 6px;
		backdrop-filter: blur(200px);
		-webkit-backdrop-filter: blur(50px);
		border: 1px solid rgba(34, 31, 31, 0.18);
		box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
	}
	.notification-content {
		width: 100%;
		padding: 12px 6px 12px 12px;
		box-sizing: border-box;
		word-wrap: break-word;

		display: grid;
		grid-template-rows: 1fr 1fr;

		&__title {
			h2 {
				font-size: 2rem;
				margin-left: 0.5rem;
			}
		}

		&__context {
			display: flex;
			justify-content: start;
			align-items: center;
			font-size: 1.25rem;

			svg {
				margin-right: 1rem;
				margin-left: 0.5rem;
			}
		}
	}
	.notification-content p {
		font-size: 14px;
		color: #a1a1a1;
		margin: 2px 0 0;
	}
</style>
