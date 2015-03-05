var bodyParser = require('body-parser');
var express = require('express');
var q = require('q');
var setUpResource = require('./server/set-up-resource');

var server = null;

module.exports = {
    start: function (states) {
        var deferred = q.defer();

        var app = express();

        app.use(bodyParser.urlencoded({extended: false}));

        app.post('/set-up', setUpResource.create(states));

        server = app.listen(8001, function () {
            deferred.resolve();
        });

        return deferred.promise;
    },
    stop: function () {
        var deferred = q.defer();

        if (server) {
            server.close(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }


        return deferred.promise;
    }
};