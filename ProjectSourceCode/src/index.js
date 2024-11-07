const express = require('express');
const exphbs = require('express-handlebars');  // Note: Do not destructure here
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

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

// Set Session
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: true,
      resave: true,
    })
);
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

// Routes

// routes for login
const user = {
    userID: undefined,
    username: undefined,
    password: undefined,
    email: undefined,
    phoneNumber: undefined,
};

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

// Authentication middleware.
const auth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
        next();
};
app.use(auth);

app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.get('/home', (req, res) => {
    res.render('pages/home');
});

//route for get jobs 
app.get('/jobs', async (req, res) => { 
    try {
        const jobs = await db.any('SELECT * FROM jobs');//query on jobs table 
        res.status(200).json(jobs); // jobs data as a JSON response for status
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Database query error' });
    }
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

