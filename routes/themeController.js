const express = require('express');
const router = express.Router();

// Theme settings
let currentTheme = 'light'; // default theme

// Route to switch theme
router.get('/theme/:theme', (req, res) => {
    const theme = req.params.theme;

    // Validate theme
    if (['light', 'dark'].includes(theme)) {
        currentTheme = theme;
    }

    // Redirect to the home page
    res.redirect('/');
});

// Middleware to provide current theme
router.use((req, res, next) => {
    res.locals.currentTheme = currentTheme; // Make the theme accessible in views
    next();
});

module.exports = router;
