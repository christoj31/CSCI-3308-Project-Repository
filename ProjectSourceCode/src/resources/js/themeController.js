// Load the stored theme or default to "emerald"
let theme = localStorage.getItem('theme') || 'emerald';

// Apply the stored or default theme on load
document.documentElement.setAttribute('data-theme', theme);
document.getElementById('theme-toggle').checked = theme === 'dim';

// Toggle theme on checkbox change
function toggleTheme() {
  theme = theme === 'dim' ? 'emerald' : 'dim';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme); // Store the theme in localStorage
}

