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
      resave: true
    })
);
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;  // Pass user info to views
    next();
});


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
                // For testing user sessions, KEEP FOR NOW
                // console.log("Session UserID:", req.session.user.userID);
                // console.log("Session Username:", req.session.user.username);
                // console.log("Session Email:", req.session.user.email);
                // console.log("Session Phone Number:", req.session.user.phoneNumber);
                
                //res.render('pages/home');
                //return res.redirect('/home');
                console.log('TEST');
                const results_query = 'SELECT * FROM jobs;';
                let results = await db.any(results_query);
                console.log('results: ', results);
                //return res.render('pages/home', {results: results, username});

                
                return res.redirect(url.format({
                    pathname:"/home",
                    query: {value}
                    })
                );
                

                // return res.redirect('/home', + username);


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
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const linkedIn = req.body.linkedIn;
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
        const insertUserQuery = 
            'INSERT INTO users (username, password, email, phoneNumber)VALUES ($1, $2, $3, $4)';
        
        const insertPOCQuery =
            'INSERT INTO pointofcontact (firstName, lastName, email, phoneNumber, linkedIn)VALUES ($1, $2, $3, $4, $5)';

        const insertUserValues = [username, password, email, phoneNumber];
        const insertPOCValues = [firstName, lastName, email, phoneNumber, linkedIn];

        await db.none(insertUserQuery, insertUserValues);
        await db.none(insertPOCQuery, insertPOCValues);

        // Redirect to login page after successful registration
        res.status(200).redirect('/login');

    } catch (err) {
        console.error('Error inserting user:', err);
        res.status(500).render('pages/register', {
            error: 'There was an issue creating your account.'
        });
    }
});

const url = require('url'); 
app.get('/home', async (req, res) => {
    
    const results_query = 'SELECT * FROM jobs;';
    let results = await db.any(results_query);
    console.log('REVIEW RESULTS: ', results);

    date_bool = false;

    if(!date_bool) {
        const now = new Date();
        console.log('NEW DATE: ', now);
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        let date_today = year + '-' + month + '-' + day;

        const insert_date_today_query = 'INSERT INTO time (date_today, date_today_string, date_today_month, date_today_day) VALUES ($1, $2, $3, $4)';
        const insert_values = [date_today, date_today, month, day];
        await db.none(insert_date_today_query, insert_values);
        
        console.log('Todays date: ', date_today);
        date_bool = true;
    }
    
    const select_time_query = 'SELECT date_today_string FROM time LIMIT 1';
    const select_time = await db.one(select_time_query);

    const final_time = select_time.date_today_string;

    if(req.query.value) {
        console.log('req.query.value', req.query.value);
        const username = req.query.value;
        const avatar_char = username.substring(0,1);

        const delete_current_user_date = 'DELETE FROM currentuser';
        await db.none(delete_current_user_date);

        const insert_current_user = 'INSERT INTO currentuser (username, avatar_char) VALUES ($1, $2)';
        await db.none(insert_current_user, [username, avatar_char]);

        return res.render('pages/home', {results: results, final_time, username, avatar_char});
    }
    else {
        const current_user_query = 'SELECT * FROM currentuser';
        const user_results = await db.one(current_user_query);
        const username = user_results.username;
        const avatar_char = user_results.avatar_char;
        return res.render('pages/home', {results: results, final_time, username, avatar_char});
    }
});

function timeDifference(date1, date2) {
    console.log('DATE1, DATE2: ', date1, date2);

    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const millisecondDifference = d2 - d1;
    console.log('D1, D2, DIFF: ', d1, d2, millisecondDifference);
    const daysDifference = millisecondDifference / 1000 / 60 / 60 / 24;

    return daysDifference;
}

app.post('/home', async (req, res) => {
    try {
        const job_name = req.body.job_name;
        const job_link = req.body.job_link;
        let due_date = req.body.due_date;
        const status = req.body.status;

        let current_date_query = 'SELECT CURRENT_DATE';
        let current_date = await db.one(current_date_query);

        date_bool = false;

        const due_date_new = new Date(due_date);
        let counter = timeDifference(current_date.current_date, due_date_new);
        
        let newstatus = 0;
        switch(status) {
            case 'none': 
                newstatus = 0;
                break;
            case 'applied': 
                newstatus = 1;
                break;
            case 'not-applied': 
                newstatus = 2;
                break;
            case 'accepted': 
                newstatus = 3;
                break;
            case 'declined': 
                newstatus = 4;
                break;
        }
        const insert_query = 'INSERT INTO jobs (jobTitle, jobApplicationLink, due_date, due_date_string, countdown, applicationStepID) VALUES ($1, $2, $3, $4, $5, $6)';
        const insertValues = [job_name, job_link, due_date, due_date, counter, newstatus];
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
        const due_date = req.body.due_date;
        console.log('REQ DUE DATE: ', due_date);
        const status = req.body.status;

        let newjob_name = job_name;
        let newjob_link = job_link;
        let newdue_date = due_date;
        let newstatus = status;

        console.log('NEW FIRST: ', newjob_name, newjob_link, newdue_date);

        const match_query = 'SELECT * FROM jobs WHERE jobid = $1 LIMIT 1';
        const results = await db.one(match_query, jobID);
        console.log('Results: ', results);

        console.log('Name', results.jobtitle);
        console.log('DUE DATE: ', due_date);
        const due_date_new = new Date(due_date);
        const getDate = due_date_new.getDate();

        if (job_name != results.jobtitle) {
            newjob_name = job_name;
        }
        if (job_link != results.jobapplicationlink) {
            newjob_link = job_link;
        }
        console.log('Status & New Status: ', status, newstatus, results.status);

        if (status != results.status) {
            console.log('Status & New Status: ', status, newstatus, results.status);
            switch(status) {
                case 'none': 
                    newstatus = 0;
                    break;
                case 'applied': 
                    newstatus = 1;
                    break;
                case 'not-applied': 
                    newstatus = 2;
                    break;
                case 'accepted': 
                    newstatus = 3;
                    break;
                case 'denied': 
                    newstatus = 4;
                    break;
            }
            console.log('FINAL STATUS: ', newstatus);
        }

        if (due_date != results.due_date) {
            newdue_date = due_date;
        }

        const now = new Date();
        const duedater = new Date(newdue_date);
        console.log('DATE: ', now, duedater);
        const counter = timeDifference(now, duedater);
        console.log('COUNTER: ', counter);

        const insert_query = 'UPDATE jobs SET jobTitle = $1, jobApplicationLink = $2, due_date = $3, due_date_string = $4, countdown = $5, applicationStepID = $6 WHERE jobID = $7';
        const insert_values = [newjob_name, newjob_link, newdue_date, newdue_date, counter, newstatus, jobID];
        await db.none(insert_query, insert_values);

        return res.redirect('/home');
    }
    catch (err) {
        console.log('Error updating event.', err);
    }
});

// app.use(express.json());


app.delete('/delete-job', auth, async (req, res) => {
    console.log('Request Body: ', req.body);
    console.log('DELETE /delete-JOB route hit');
    const jobID = req.body.jobID;


    console.log('Job ID: ', jobID);


    if(!jobID) {
        return res.status(400).json({ message: "Job ID is required" });
    }


    try {
        const query = `DELETE FROM jobs WHERE jobID = $1 RETURNING *`;
        const results = await db.result(query, jobID);


        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }


        res.json({ message: 'Job successfully deleted' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Server error deleting job' })
    }
});

// Logout route
app.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Logout failed.' });
            }
            res.status(200).json({ message: 'Logged out successfully.' });
        });
    } else {
        res.status(200).json({ message: 'No active session to log out.' });
    }
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

app.use('/dropdown', dropdownRoutes);

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app.listen(3000);

//test for lab 11
app.get('/welcome', (req, res) => {
    res.json({status: 'success', message: 'Welcome!'});
  });
