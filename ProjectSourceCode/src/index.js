const express = require('express');
const exphbs = require('express-handlebars');  // Note: Do not destructure here
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const pgp = require('pg-promise')();
const dropdownRoutes = require('../src/server/routes/dropdownRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

//middleware to parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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


// Store user data
const user = {
    userID: undefined,
    username: undefined,
    password: undefined,
    email: undefined,
    phoneNumber: undefined,
};

// routes for login

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
                return res.status(200).redirect('/home');
            }

            else {
                return res.status(400).render('pages/login', {
                    error: 'Incorrect username or password.'
                });
            }
        }
        
    } catch (error) {
        console.error('Error occurred', error);
        res.status(500).render('pages/login', { error: 'An error occurred. Please try again.' });
    }    
});

// Authentication middleware
const auth = (req, res, next) => {
    console.log('Auth middleware called for path:', req.path);

    if (req.path === '/login' || req.path === '/register' 
        || req.path === '/welcome' || req.path === '/jobs') {
        return next();
    }

    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};
app.use(auth);

// Register account routes
app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const phoneNumber = req.body.phoneNumber;
        const password = req.body.password;
        const retypePassword = req.body['retype password'];
        const checkQuery = 'SELECT username FROM users WHERE username = $1 LIMIT 1';
        const checkValues = [username];

        // regex input validators
        const checkEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const checkPhoneNumber = /^\d{10}$|^\d{3}-\d{3}-\d{4}$/;
        const passwordPattern = /^(?!.*(.)\1)[A-Za-z\d@$!%*?&]{8,}$/;
        const containsUpperCase = /[A-Z]/.test(password);
        const containsLowerCase = /[a-z]/.test(password);
        const containsDigit = /\d/.test(password);
        const containsSpecial = /[@$!%*?&]/.test(password);

        const existingUser = await db.oneOrNone(checkQuery, checkValues);

        if (username == null) {
            return res.status(407).render('pages/register', {
                error: 'Username not given'
            });
        }

        // check if username already exists
        if (existingUser) {
            return res.status(400).render('pages/register', {
                error: 'Username already taken.'
            });
        }

        // check if valid email input
        if (!checkEmail.test(email)) {
            return res.status(401).render('pages/register', {
                error: 'Please enter a valid email address.'
            });
        }

        // check if valid phone number input
        if (!checkPhoneNumber.test(phoneNumber)) {
            return res.status(402).render('pages/register', {
                error: 'Please enter a valid phone number (e.g., 123-456-7890 or 1234567890).'
            });
        }

        // check if password and retyped passwords match
        if (password !== retypePassword) {
            return res.status(403).render('pages/register', {
                error: 'Passwords do not match.'
            });
        }

        // check if password meets criteria
        if (!passwordPattern.test(password) || !containsUpperCase 
            || !containsLowerCase || !containsDigit || !containsSpecial) {
            return res.status(404).render('pages/register', {
                error: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, one special character, and no consecutive repeated characters.'
            });
        }

        // Insert the new user into the database
        const insertQuery = 
            'INSERT INTO users (username, password, email, phoneNumber)VALUES ($1, $2, $3, $4)';

        const insertValues = [username, password, email, phoneNumber];

        await db.none(insertQuery, insertValues);

        // Redirect to login page after successful registration
        res.status(200).redirect('/login');

    } catch (err) {
        console.error('Error inserting user:', err);
        res.status(500).render('pages/register', {
            error: 'There was an issue creating your account.'
        });
    }
});

app.get('/home', async (req, res) => {
    const results_query = 'SELECT * FROM jobs;';
    let results = await db.any(results_query);
    console.log('results: ', results);
    return res.render('pages/home', {results: results});
});


app.post('/home', async (req, res) => {
    try {
        const jobID = req.body.jobID;
        const job_name = req.body.job_name;
        const job_link = req.body.job_link;
        const due_date = req.body.due_date;
        //const status = req.body.status;

        const query = 'SELECT jobID FROM jobs WHERE jobID = $1 LIMIT 1';
        const check_values = [jobID];

        const job_exists = await db.oneOrNone(query, check_values);
        if (job_exists) {
                return res.status(400).render('pages/home', {
                    error: 'Job already listed.'
                });
            }

        const generate_job_id_query = 'SELECT jobID FROM jobs ORDER BY jobID DESC LIMIT 1';
        let result = await db.one(generate_job_id_query);
        let job_id = result.jobid;
        job_id += 1; 

        const insert_query = 'INSERT INTO jobs (jobID, jobTitle, jobApplicationLink, due_date) VALUES ($1, $2, $3, $4)';
        const insertValues = [job_id, job_name, job_link, due_date];
        await db.none(insert_query, insertValues);

        return res.redirect('/home');

    } catch (err) {
        console.error('Error creating event.', err);
    }
});

app.post('/editModal', async (req, res) => {
    try {
        console.log('Body: ', req.body);
        const jobID = req.body.jobid;
        const job_name = req.body.job_name;
        const job_link = req.body.job_link;
        const status = req.body.status;

        let newjob_name = job_name;
        let newjob_link = job_link;
        let newstatus = status;

        console.log('NEW FIRST: ', newjob_name, newjob_link);

        const match_query = 'SELECT * FROM jobs WHERE jobid = $1 LIMIT 1';
        const results = await db.one(match_query, jobID);
        console.log('Results: ', results);

        console.log('Name', results.jobtitle);

        if (job_name != results.jobtitle) {
            newjob_name = job_name;
        }
        if (job_link != results.jobapplicationlink) {
            newjob_link = job_link;
        }
        if (status != results.status) {
            newstatus = status;
        }

        console.log('NEW: ', newjob_name, newjob_link);

        const insert_query = 'UPDATE jobs SET jobTitle = $1, jobApplicationLink = $2 WHERE jobID = $3';
        const insert_values = [newjob_name, newjob_link, jobID];
        await db.none(insert_query, insert_values);

        const results_query = 'SELECT * FROM jobs;';
        let result = await db.any(results_query);
        //console.log('results: ', results);

        return res.render('pages/home', {results: result});
    }
    catch (err) {
        console.log('Error updating event.', err);
    }
});

app.delete('/home/:id', (req, res) => {
    const jobId = parseInt(req.params.id);
    const jobIndex = jobs.findIndex(job => job.id === jobId);

    if(jobIndex !== -1) {
        jobs.splice(jobIndex, 1);
        res.status(200).json({ message: 'Job deleted successfully' });
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
})

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

app.use('/dropdown', dropdownRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app.listen(3000);

//test for lab 11
app.get('/welcome', (req, res) => {
    res.json({status: 'success', message: 'Welcome!'});
  });
