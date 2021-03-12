// =======================================================================================
// BASE SETUP starts

// call packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user-model'); // Pulls user-model.js file

// configure app to body-parser (to get data from a POST action)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to local database
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/Credentials");

// Set PORT to 3000
var port = process.env.PORT || 3000;

// BASE SETUP ends
// =======================================================================================
// ROUTES TO OUR API starts
// routes are performed in order they are written

var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    console.log('Middleware used for all requests.');
    next();                // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to our API!' });   
});

// route with '/users' endpoint
router.route('/users')

    // create a user
    .post(function(req, res) {

        var user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.num = req.body.num;
        user.pword = req.body.pword;

        // save the user and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });

    })

    // get all the users
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

// route with '/users/:user_id' endpoint
// ----------------------------------------------------
router.route('/users/:user_id')

    // get the user with that id
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })

    // update the user with this id
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {

            if (err)
                res.send(err);

            user.name = req.body.name;
            user.email = req.body.email;
            user.num = req.body.num;
            user.pword = req.body.pword;  // update the users info

            // save the user
            user.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'User updated!' });
            });
        });
    })

    // delete the user with this id
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
// more routes for our API will happen here


// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
app.use('/api', router);

// ROUTES TO OUR API ends
// =======================================================================================
// SERVER starts

app.listen(port);
console.log('Listening at ' + port);

// SERVER ends
// =======================================================================================