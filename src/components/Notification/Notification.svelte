<script lang="ts">
	import { onDestroy } from 'svelte';
	import { removeNotification, type INotification } from './notificationsStore';

	export let item: ConstructorOfATypedSvelteComponent;
	export let notification: INotification;
	export let withoutStyles = false;

	const removeNotificationHandler = () => removeNotification(id);
	let timeout: NodeJS.Timeout;

	$: ({ id, removeAfter } = notification);

	$: if (removeAfter) {
		timeout = setTimeout(removeNotificationHandler, removeAfter);
	}

	onDestroy(() => {
		if (removeAfter && timeout) clearTimeout(timeout);
	});
</script>

<svelte:component this={item} {notification} {withoutStyles} onRemove={removeNotificationHandler} />
