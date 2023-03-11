<script lang="ts">
	import Notification from './Notification.svelte';
	import { notificationStore } from './notificationsStore';

	export let item: ConstructorOfATypedSvelteComponent;
</script>

<slot />
<div class="notifications">
	<div class="notification-position">
		{#each $notificationStore as notification}
			<Notification {notification} {item} />
		{/each}
	</div>
</div>

<style>
	.notification-position {
		position: fixed;
		max-width: 400px;
		bottom: 0;
		left: 0;
	}
</style>
