const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const themeController = require('./resources/js/themeController'); // Adjust if necessary
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Set Handlebars as the view engine

const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server

const hbs = exphbs.create({
    extname: '.hbs',
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main',
    helpers: {
        extend: function(name, options) {
            // Here you can define how to extend your templates
            // This is a basic implementation and might need adjustments
            if (!this._blocks) this._blocks = {};
            this._blocks[name] = options.fn(this);
            return null;
        },
        block: function(name) {
            return (this._blocks && this._blocks[name]) ? this._blocks[name] : null;
        },
        content: function(name) {
            // Returns the content block based on the name provided
            return (this._blocks && this._blocks[name]) ? this._blocks[name] : null;
        }
    }
});

app.engine('hbs', hbs.engine);


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

  
// Duplicate app.engine declaration from above, KEEPING JUST IN CASE
// app.engine('hbs', express({
//     extname: '.hbs',
//     layoutsDir: path.join(__dirname, 'views/layouts'), // Adjust path if needed
//     defaultLayout: 'main'
// }));


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

app.get('/', (req, res) => {
    res.redirect('/home');
});

// -------------------------------------  ROUTES for login.hbs   ----------------------------------------------

const user = {
    userID: undefined,
    username: undefined,
    password: undefined,
    email: undefined,
    phoneNumber: undefined,
};

app.get('/login', (req, res) => {
    res.render('pages/login');
});

// TODO for Irene: Login submission
// app.post('/login', (req, res) => {
    
// });

// Authentication middleware.
const auth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
        next();
};

app.use(auth);

// -------------------------------------  ROUTES for register.hbs   --------------------------------------------

app.get('/register', (req, res) => {
    res.render('pages/register');
});

// TODO for Irene: Register submission
// app.post('/register', (req, res) => {
    
// });

// -------------------------------------  ROUTES for home.hbs   --------------------------------------------

app.get('/home', (req, res) => {
    res.render('pages/home');
});

// Use the theme controller for routes
app.use('/', themeController);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'src/resources')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
