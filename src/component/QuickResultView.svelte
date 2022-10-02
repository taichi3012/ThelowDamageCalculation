<script>
	import { fly } from "svelte/transition";

    export let normalResult;
    export let criticalResult;

    let show = false;

	document.addEventListener("DOMContentLoaded", function(){
		const observer = new IntersectionObserver(
			entries => {entries.forEach(e => show = !e.isIntersecting)},
			{threshold: 0.75}
		);

		observer.observe(document.documentElement.getElementsByClassName("result")[0]);
  	});
</script>


{#if show}
<div class="view space-around text-center" transition:fly="{{delay: 1}}">
	<div class="vbox">
		<small>通常</small>
		<span class="text-big">{$normalResult.toFixed(2)}</span>
	</div>
	<div class="vbox">
		<small>クリティカル</small>
		<span class="text-big">{$criticalResult.toFixed(2)}</span>
	</div>
</div>
{/if}

<style>
	.view {
		display: flex;
		flex-direction: row;
		position: fixed;
		top: 0;
		left: 0;
		min-width: 100vw;
		padding: 1em 0 1em;
		font-size: 0.55em;
		backdrop-filter: blur(6px) brightness(90%);
	}
</style>

