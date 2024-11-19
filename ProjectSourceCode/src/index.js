// Irene's branch
const express = require('express');
const exphbs = require('express-handlebars');  // Note: Do not destructure here
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const pgp = require('pg-promise')();
const dropdownRoutes = require('../src/server/routes/dropdownRoutes');

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

// Authentication middleware. NOTE: Irene will include this once auth testing is finished
// const auth = (req, res, next) => {
//     if (!req.session.user) {
//         return res.redirect('/login');
//     }
//         next();
// };
// app.use(auth);

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

        const checkQuery = 'SELECT username FROM users WHERE username = $1 LIMIT 1';
        const checkValues = [username];
        
        const existingUser = await db.oneOrNone(checkQuery, checkValues);

        // check if username already exists
        if (existingUser) {
            return res.status(400).render('pages/register', {
                error: 'Username already taken.'
            });
        }

        // Insert the new user into the database
        const insertQuery = 
            'INSERT INTO users (username, password, email, phoneNumber)VALUES ($1, $2, $3, $4)';

        const insertValues = [username, password, email, phoneNumber];

        await db.none(insertQuery, insertValues);

        // Redirect to login page after successful registration
        res.redirect('/login');

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
        const jobID = req.body.jobID;
        const job_name = req.body.job_name;
        const job_link = req.body.job_link;
        let due_date = req.body.due_date;
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

        let current_date_query = 'SELECT  CURRENT_DATE';
        let current_date = await db.one(current_date_query);

        date_bool = false;

        const due_date_new = new Date(due_date);
        let counter = timeDifference(current_date.current_date, due_date_new);

        const insert_query = 'INSERT INTO jobs (jobID, jobTitle, jobApplicationLink, due_date, due_date_string, countdown) VALUES ($1, $2, $3, $4, $5, $6)';
        const insertValues = [job_id, job_name, job_link, due_date, due_date, counter];
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
        if (status != results.status) {
            newstatus = status;
        }
        if (due_date != results.due_date) {
            newdue_date = due_date;
        }

        console.log('NEW: ', newjob_name, newjob_link, newdue_date);

        const now = new Date();
        const duedater = new Date(newdue_date);
        console.log('DATE: ', now, duedater);
        const counter = timeDifference(now, duedater);
        console.log('COUNTER: ', counter);

        const insert_query = 'UPDATE jobs SET jobTitle = $1, jobApplicationLink = $2, due_date = $3, due_date_string = $4, countdown = $5 WHERE jobID = $6';
        const insert_values = [newjob_name, newjob_link, newdue_date, newdue_date, counter, jobID];
        await db.none(insert_query, insert_values);

        return res.redirect('/home');
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

//test for lab 11
app.get('/welcome', (req, res) => {
    res.json({status: 'success', message: 'Welcome!'});
  });
