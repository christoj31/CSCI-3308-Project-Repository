const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const pgp = require('pg-promise')();
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Handlebars engine
const hbs = exphbs.create({
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: path.join(__dirname, 'views/partials')
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Database configuration
const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
};

const db = pgp(dbConfig);

db.connect()
    .then(obj => {
        console.log('Database connection successful');
        obj.done();
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });

// Set up session
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));

// Authentication middleware
const auth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Public routes
app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.post('/login', async (req, res) => {
    try {
        const query = `SELECT username, password FROM users WHERE username = $1`;
        const value = [req.body.username];

        const user = await db.oneOrNone(query, value);
        if (!user) {
            return res.status(401).render('pages/login', { error: 'Incorrect username or password.' });
        }

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(401).render('pages/login', { error: 'Incorrect username or password.' });
        }

        req.session.user = user;
        req.session.save();
        res.redirect('/home');
    } catch (error) {
        console.error('Error occurred: ', error);
        res.render('pages/login');
    }
});

app.get('/register', (req, res) => {
    res.render('pages/register');
});

// Protected routes
app.get('/home', auth, (req, res) => {
    res.render('pages/home');
});

app.get('/jobs', auth, async (req, res) => {
    try {
        const jobs = await db.any('SELECT * FROM jobs');
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Database query error' });
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.redirect('/home');
        }
        res.redirect('/login');
    });
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Test route (for lab purposes)
app.get('/welcome', (req, res) => {
    res.json({ status: 'success', message: 'Welcome!' });
});
