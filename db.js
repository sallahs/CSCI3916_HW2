/**
 * Created by shawnmccarthy on 1/22/17.
 */
'use strict;';
//Include crypto to generate the movie id
var crypto = require('crypto');
module.exports = function () {
    return {
        userList: [],
        movieList: [],
        /*
         * Save the user inside the "db".
         */
        save: function (user) {
            user.id = crypto.randomBytes(20).toString('hex'); // fast enough for our purpose
            this.userList.push(user);
            return 1;
        },

        find: function (id) {
            if (id) {
                return this.userList.find(function (element) {
                    return element.id === id;
                });
            }
            else {
                return this.userList;
            }
        },
        findOne: function (name) {
            if (name) {
                return this.userList.find(function (element) {
                    return element.username === name;
                });
            }
            else {
                return null;
            }
        },
        /*
         * Save a movie by name. POST
         */
        saveMovie: function(movie) {
            movie.movieId = crypto.randomBytes(20).toString('hex'); // fast enough for our purpose
            this.movieList.push(movie);
            return movie.movieId;
        },
        /*
         * Retrieve a movie with a given id or return all the movies if the id is undefined. GET
         */
        findMovie: function (Id) {
            if (Id) {
                return this.movieList.find(function (element) {
                    return element.movieId === Id;
                });
            }
            else {
                return this.movieList;
            }
        },
        /*
         * Retrieve a movie with a given id or return null if the id is undefined. DELETE
         */
        findOneMovie: function(Id) {
            if (Id) {
                return this.movieList.find(function (element) {
                    return element.movieId === Id;
                });
            }
            else {
                return null;
            }
        },
        /*
         * Delete a movie with the given id. DELETE
         */
        remove: function(Id) {
            var found = 0;
            this.movieList = this.movieList.filter(function (element) {
                if (element.movieId === Id) {
                    found = 1;
                }
                else {
                    return element.movieId !== Id;
                }
            });
            return found;
        },
        /*
         * Update a movie with the given id. PUT
         */
        updateMovie: function (Id, name) {
            var movieIndex = this.movieList.findIndex(function (element) {
                return element.movieId === Id;
            });
            if (movieIndex !== -1) {
                this.movieList[movieIndex].moviename = name;
                return 1;
            }
            else {
                return 0;
            }
        }
    };
};