<script>
  function copyURL() {
    navigator.clipboard.writeText(location.href);
  }
</script>

<button onclick={copyURL}>
  <span class="material-icons">
    share
  </span>
</button>

<style>
  button {
    padding: 0;
    border: none;
    outline: none;
    font: inherit;
    color: inherit;
    background: none;
    cursor: pointer;
    margin: 0 0.25em;
  }
</style>
