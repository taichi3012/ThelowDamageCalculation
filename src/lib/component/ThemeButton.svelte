<script lang="ts">
  import {onMount, tick} from "svelte";

  let darkMode: boolean = $state(false);

  function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem("dark_mode", "" + darkMode);
    applyTheme();
  }

  function applyTheme() {
    if (darkMode) {
      document.documentElement.setAttribute("theme", "dark");
    } else {
      document.documentElement.removeAttribute("theme");
    }
  }

  onMount(async () => {
    document.body.style.transition = "none";
    await tick();
    darkMode = localStorage.getItem("dark_mode") == "true";
    applyTheme();
    await tick();
    await tick();
    document.body.style.transition = "";
  });
</script>

<button onclick={toggleDarkMode}>
  <span class="material-icons" class:dark={darkMode} class:light={!darkMode}>
    {darkMode ? "dark_mode" : "light_mode"}
  </span>
</button>

<style>
  button {
    padding: 0;
    border: none;
    outline: none;
    font: inherit;
    color: inherit;
    width: 3em;
    border-radius: 1em;
    background: var(--bg-sub);
    user-select: none;
    cursor: pointer;
    margin: 0 0.25em;
    height: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .light {
    transition: transform ease-in 0.3s;
    transform: translateX(-0.5em);
  }

  .dark {
    transition: transform ease-in 0.3s;
    transform: translateX(0.5em);
  }
</style>
