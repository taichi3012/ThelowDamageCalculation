<script lang="ts">
  import {onMount} from "svelte";
  import {fade} from "svelte/transition";

  let {
    normalResult,
    criticalResult
  } = $props();

  let show = $state(false);

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (show = !e.isIntersecting));
      },
      {threshold: 0.75}
    );

    observer.observe(
      document.querySelector(".result")!
    );
  });
</script>

{#if show}
  <div class="view space-around text-center" transition:fade={{ duration: 500 }}>
    <div class="vbox">
      <small>通常</small>
      <span class="text-big">{normalResult.toFixed(2)}</span>
    </div>
    <div class="vbox">
      <small>クリティカル</small>
      <span class="text-big">{criticalResult.toFixed(2)}</span>
    </div>
  </div>
{/if}

<style>
  .view {
    anchor-name: --result-view;
    display: flex;
    flex-direction: row;
    position: fixed;
    top: 0;
    left: 0;
    min-width: 100vw;
    padding: 1em 0 1em;
    font-size: 0.5em;
    backdrop-filter: blur(6px) brightness(90%);
  }
</style>
