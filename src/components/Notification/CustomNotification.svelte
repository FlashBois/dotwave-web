<script lang="ts">
	import Loader from '$components/Loader/Loader.svelte';
	import { fade } from 'svelte/transition';
	import NotificationLink from './NotificationLink.svelte';
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
				<NotificationLink signature={notification.signature} />
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
				<NotificationLink signature={notification.signature} />
			</div>
		</div>
	{:else if notification.type == 'unknown'}
		<div class="notification-content">
			<div class="notification-content__title">
				<h2>{notification.text} unknown</h2>
			</div>
			<div class="notification-content__context">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="#df9432"
					class="bi bi-question-circle-fill"
					viewBox="0 0 16 16"
				>
					<path
						d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"
					/>
				</svg>
				<NotificationLink signature={notification.signature} />
			</div>
		</div>
	{:else}
		<div class="notification-content">
			<div class="notification-content__title">
				<h2>Confirming transaction</h2>
			</div>
			<div class="notification-content__context">
				<Loader />
				Transaction: {notification.text}
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
		background: #201c178e;
		color: #ffffff9d;
		border-radius: 6px;
		backdrop-filter: blur(200px);
		-webkit-backdrop-filter: blur(200px);
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
</style>
