<script>
	import { blur, scale } from "svelte/transition";
	export let show = false;

	export let icon = "checked";
	export let message = "";

	function close() {
		show = false;
	}
</script>

{#if show}
	<div class="bg" transition:blur on:click={close}>
		<div class="fg">
			<span class="icon material-icons" transition:scale={{ delay: 250 }}>{icon}</span>
			<p>{message}</p>
		</div>
	</div>
{/if}

<style>
	.bg {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		backdrop-filter: blur(7px) brightness(80%);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.fg {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.icon {
		display: block;
		font-size: 3em;
		width: 1em;
		height: 1em;
	}
</style>
