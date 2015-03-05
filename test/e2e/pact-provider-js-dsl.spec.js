var childProcess = require('child_process');
var express = require('express');
var q = require('q');

var startServer = function () {
    var deferred = q.defer();

    var app = express();

    app.get('/changeState', function (request, response) {
        server.callCount += 1;
        response.end();
    });

    var server = app.listen(8000, function () {
        deferred.resolve(server);
    });

    server.callCount = 0;

    return deferred.promise;
};

var stopServer = function (server) {
    var deferred = q.defer();

    server.close(function () {
        deferred.resolve();
    });

    return deferred.promise;
};

describe('pact-provider-js-dsl', function () {
    var server;

    beforeEach(function (done) {
        startServer().then(function (newServer) {
            server = newServer;
            done();
        });
    });

    afterEach(function (done) {
        stopServer(server).then(done);
    });

    it('should call the setUp callback function for each provider state', function (done) {
        var command = [
            'node ./lib/cli.js',
            '--pactFile=./test/e2e/fixtures/set-up-pact.json',
            '--pactHelper=./test/e2e/fixtures/set-up-helper.js'
        ].join(' ');

        childProcess.exec(command, function (error, stdout, stderr) {
            console.log(stdout.toString());

            expect(error).toBeFalsy('The cli error: ' + error);
            expect(stderr.toString()).toBe('');
            expect(server.callCount).toBe(1, 'the number of times changeState is called');

            done();
        });
    });
});