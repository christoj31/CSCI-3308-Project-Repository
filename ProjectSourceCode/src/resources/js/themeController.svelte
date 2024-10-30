<!-- src/lib/ThemeToggle.svelte -->
<script>
  import { onMount } from 'svelte';

  // Set the default theme
  let theme = "emerald";

  // Function to toggle themes
  function toggleTheme() {
    theme = theme === "emerald" ? "dim" : "emerald";
    document.documentElement.setAttribute("data-theme", theme);
  }

  // Apply the default theme on mount
  onMount(() => {
    document.documentElement.setAttribute("data-theme", theme);
  });
</script>

<label class="cursor-pointer flex items-center space-x-2">
  <span>emerald Theme</span>
  <input type="checkbox" bind:checked={theme} on:change={toggleTheme} class="toggle theme-controller" />
</label> 

<style>
/* Optional custom styles */
</style>
