const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const themeController = require('./resources/js/themeController'); // Adjust if necessary

const app = express();
const PORT = process.env.PORT || 3000;

// Set Handlebars as the view engine

// const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server

// Set up Handlebars engine with main layout
app.engine('hbs', exphbs.engine({ 
    layoutsDir: path.join(__dirname, 'views/layouts'), 
    defaultLayout: 'main', 
    extname: '.hbs',
    partialsDir: path.join(__dirname, 'views/partials')
  }));
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, 'views'));
  
  // Serve static files
  app.use('/src/resources', express.static(path.join(__dirname, 'resources')));

/*
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
*/
  
/*
app.engine('hbs', express({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'), // Adjust path if needed
    defaultLayout: 'main'
}));
*/


app.get('/', (req, res) => {
    res.redirect('/login');
});


// -------------------------------------  ROUTES for login.hbs   ----------------------------------------------

app.get('/login', (req, res) => {
    res.render('pages/login');
});

// TODO for Irene: Login submission
// app.post('/login', (req, res) => {
    
// });

// -------------------------------------  ROUTES for register.hbs   --------------------------------------------

app.get('/register', (req, res) => {
    res.render('pages/register');
});

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
