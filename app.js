const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const {getHomePage} = require('./routes/index');
const {addCarPage, addCar, deleteCar, editCar, editCarPage, viewCars, getPrice, login, loginUser} = require('./routes/cars');
const port = 5000;
// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'bzbfafebqcv8qi9bu2ht-mysql.services.clever-cloud.com',
    user: 'u9lrmhkgfgpeoayv',
    password: '0kGoIaiYJnVljNOmo6y1',
    database: 'bzbfafebqcv8qi9bu2ht',
    port: 3306
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app
app.get('/', getHomePage);
app.get('/add', addCarPage);
app.get('/edit/:id', editCarPage);
app.get('/delete/:id', deleteCar);
app.get('/price/:id', getPrice);
app.get('/login', login);
app.get('/view/:id', viewCars);
app.post('/add', addCar);
app.post('/edit/:id', editCar);
app.post('/login', loginUser);

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});