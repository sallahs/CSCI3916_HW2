/*
CSC3916 HW2
File: Server.js
Description: Web API scaffolding for Movie API
 */

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
db = require('./db')(); //hack
var jwt = require('jsonwebtoken');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

router.route('/signup')
    .post(function(req, res) {
        if (!req.body.username || !req.body.password) {
            res.json({success: false, msg: 'Please include both username and password to signup.'})
        } else {
            var newUser = {
                username: req.body.username,
                password: req.body.password
            };

            db.save(newUser); //no duplicate checking
            res.json({success: true, msg: 'Successfully created new user.'})
        }
    })
    .get(function (req,res){
        res.status(400).send('HTTP method GET not supported')

    })
    .delete(function (req,res){
        res.status(400).send('HTTP method DELETE not supported')

    })
    .put(function (req,res){
        res.status(400).send('HTTP method PUT not supported')

    })



router.route('/signin')
    .post(function (req, res) {
        var user = db.findOne(req.body.username);

        if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            if (req.body.password == user.password) {
                var userToken = {id: user.id, username: user.username};
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json({success: true, token: 'JWT ' + token});
            } else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        }
    })
    .get(function (req,res){
        res.status(400).send('HTTP method GET not supported')

    })
    .delete(function (req,res){
        res.status(400).send('HTTP method DELETE not supported')

    })
    .put(function (req,res){
        res.status(400).send('HTTP method PUT not supported')

    })


router.route('/moviecollection')
    .post(function(req, res){
        if(!req.body.moviename){
            let o = getJSONObjectForMovieRequirement(req);
            res.json({success: false, msg: 'Please include a movie name to add a movie.', headers: JSON.stringify(o.headers), query: JSON.stringify(o.body), env: o.key.toString()})
        } else {
            var newMovie = {
                moviename: req.body.moviename
            };

            let movId = db.saveMovie(newMovie);
            let o = getJSONObjectForMovieRequirement(req);
            res.status(200);
            res.json({success:true, msg: 'movie saved. Name is: ' + newMovie.moviename.toString() + ', movieId is: ' + movId, headers: JSON.stringify(o.headers), query: JSON.stringify(o.body), env: o.key.toString()});
        }
    })
    .get(function(req, res){
        let movie = db.findMovie(req.body.movieId);
        if (!movie) {
            let o = getJSONObjectForMovieRequirement(req);
            res.json({success: false, msg: 'Movie not found', headers: JSON.stringify(o.headers), query: JSON.stringify(o.body), env: o.key.toString()});
            res.status(200);
        }
        else{
            let o = getJSONObjectForMovieRequirement(req);
            res.json({success:true, msg: JSON.stringify(movie), headers: JSON.stringify(o.headers), query: JSON.stringify(o.body), env: o.key.toString()});
            res.status(200);
        }

    })
    .delete(authController.isAuthenticated, function(req, res) {
        console.log(req.body);
        if (req.get('Content-Type')) {
            res = res.type(req.get('Content-Type'));
        }
        var o = getJSONObjectForMovieRequirement(req);
        let movie = db.findOneMovie(req.body.movieId);
        if(!movie){
            res.status(200);
            res.json({success: false, msg: 'Movie not found', headers: JSON.stringify(o.headers), query: JSON.stringify(o.body), env: o.key.toString()});
        }
        else {
            db.remove(req.body.movieId);
            res.status(200);
            res.json({success: true, msg: 'Movie deleted', headers: JSON.stringify(o.headers), query: JSON.stringify(o.body), env: o.key.toString()});
        }
    }
    )
    .put(authJwtController.isAuthenticated, function(req, res) {
        console.log(req.body);
        if (req.get('Content-Type')) {
            res = res.type(req.get('Content-Type'));
        }
        var o = getJSONObjectForMovieRequirement(req);
        let movie = db.findMovie(req.body.movieId);
        if(!movie){
            res.status(200);
            res.json({success: false, msg: 'Movie not found', headers: JSON.stringify(o.headers), query: JSON.stringify(o.body), env: o.key.toString()});
        }
        else {
            db.updateMovie(req.body.movieId, req.body.moviename);
            res.status(200);
            res.json({success: true, msg: 'Movie updated', headers: JSON.stringify(o.headers), query: JSON.stringify(o.body), env: o.key.toString()});
        }


    })
    .patch(function (req,res){
        res.status(400).send('HTTP method PATCH not supported')

    })

app.use('/', router);
app.listen(process.env.PORT || 8080);

