<script lang="ts">
  import { onMount } from "svelte";

  onMount(() => {
    document.documentElement.style.display = "block";
  });
</script>

<slot/>

<style>
  :global(:root) {
    display: none;
  }
</style>
