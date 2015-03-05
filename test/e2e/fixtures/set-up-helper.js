var request = require('request');

var changeState = function (callback) {
    var requestOptions = {
        method: 'GET',
        url: 'http://localhost:8000/changeState'
    };

    request(requestOptions, callback);
};

module.exports = function (pact) {
    pact.providerStatesFor('A Consumer', function () {
        this.providerState('the provider works', function () {
            this.setUp(function (done) {
                changeState(done);
            });
        });
    });
};