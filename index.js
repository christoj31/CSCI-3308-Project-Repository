const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const themeController = require('./routes/themeController'); // Adjust if necessary

const app = express();
const PORT = process.env.PORT || 3000;

// Set Handlebars as the view engine
app.engine('hbs', exphbs({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'), // Adjust path if needed
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Use the theme controller for routes
app.use('/', themeController);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
