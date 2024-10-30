const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const themeController = require('./resources/js/themeController'); // Adjust if necessary

const app = express();
const PORT = process.env.PORT || 3000;

// Set Handlebars as the view engine

// const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server

const hbs = exphbs.create({
    extname: '.hbs',
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main'
});

app.engine('hbs', hbs.engine);

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

app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

// Use the theme controller for routes
app.use('/', themeController);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
