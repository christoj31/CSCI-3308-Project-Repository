const express = require('express');
const exphbs = require('express-handlebars');  // Note: Do not destructure here
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Handlebars engine
app.engine('hbs', exphbs({
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.get('/home', (req, res) => {
    res.render('pages/home');
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
