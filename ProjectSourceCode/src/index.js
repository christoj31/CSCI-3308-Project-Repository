// Irene's branch
const express = require('express');
const exphbs = require('express-handlebars');  // Note: Do not destructure here
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const pgp = require('pg-promise')();

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
      console.log('Database connection successful'); // you can view this message in the docker compose logs
      obj.done(); // success, release the connection;
    })
    .catch(error => {
      console.log('ERROR:', error.message || error);
    });

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


app.post('/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const query = 'SELECT * FROM users WHERE username = $1 LIMIT 1';
        const value = [username];
    
        const user = await db.one(query, value);
    
        // Check if the user exists and if the password matches
        if (user) {
            // check if password matches
            if (password == user.password){
                req.session.user = {
                    userID: user.userID,
                    username: username,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                };
    
                req.session.save();
                // For testing user sessions, KEEP FOR NOW
                // console.log("Session UserID:", req.session.user.userID);
                // console.log("Session Username:", req.session.user.username);
                // console.log("Session Email:", req.session.user.email);
                // console.log("Session Phone Number:", req.session.user.phoneNumber);
                return res.redirect('/home');
            }

            else {
                return res.status(401).render('pages/login', {
                    error: 'Incorrect username or password.'
                });
            }
        }
        
    } catch (error) {
        console.error('Error occurred', error);
        res.status(500).render('pages/login', { error: 'An error occurred. Please try again.' });
    }    
});

// Authentication middleware.
// const auth = (req, res, next) => {
//     if (!req.session.user) {
//         return res.redirect('/login');
//     }
//         next();
// };
// app.use(auth);

app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.post('/register', async (req, res) => {
    const { username, password, email, phoneNumber } = req.body;

    // Step 1: Validation
    if (!username || !password || !email || !phoneNumber) {
        return res.status(400).render('pages/register', {
            error: 'All fields are required.'
        });
    }

    // Step 2: Check if the username already exists
    const checkQuery = 'SELECT username FROM users WHERE username = $1 LIMIT 1';
    const checkValues = [username];

    try {
        const existingUser = await db.oneOrNone(checkQuery, checkValues);

        if (existingUser) {
            return res.status(400).render('pages/register', {
                error: 'Username already taken.'
            });
        }

        // Step 3: Insert the new user into the database (storing plain text password)
        const insertQuery = `
            INSERT INTO users (username, password, email, phoneNumber)
            VALUES ($1, $2, $3, $4)
        `;
        const insertValues = [username, password, email, phoneNumber];

        await db.none(insertQuery, insertValues);

        // Step 4: Redirect to login page after successful registration
        res.redirect('/login');
    } catch (err) {
        console.error('Error inserting user:', err);
        res.status(500).render('pages/register', {
            error: 'There was an issue creating your account.'
        });
    }
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

//test for lab 11
app.get('/welcome', (req, res) => {
    res.json({status: 'success', message: 'Welcome!'});
  });