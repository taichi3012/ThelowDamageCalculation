<script lang="ts">
	import { onMount } from "svelte";

	export let darkMode: boolean;

	function toggleDarkMode() {
		darkMode = !darkMode;
		localStorage.setItem("dark_mode", "" + darkMode);
		applyTheme();
	}

	function applyTheme() {
		//Apply theme attribute
		if (darkMode) {
			document.documentElement.setAttribute("theme", "dark");
		} else {
			document.documentElement.removeAttribute("theme");
		}
	}

	onMount(applyTheme);
</script>

<div on:click={toggleDarkMode}>
	<span class="material-icons" class:dark={darkMode} class:light={!darkMode}
		>{darkMode ? "dark_mode" : "light_mode"}</span
	>
</div>

<style>
	div {
		width: 3em;
		border-radius: 1em;
		background: var(--bg-sub);
		user-select: none;
		cursor: pointer;
		position: absolute;
		top: 1em;
		right: 1em;
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
		justify-content: right;
	}
</style>
