var logger = require('./pact-verify-task/logger');
var server = require('./pact-verify-task/server');
var pactStateReader = require('./pact-verify-task/pact-state-reader');
var pactVerifyRubyCommand = require('./pact-verify-task/pact-verify-ruby-command');
var q = require('q');

module.exports = function (pactFile, pactHelper) {
    return pactStateReader.processHelper(pactHelper)
        .then(server.start)
        .then(function (serverInstance) {
            return pactVerifyRubyCommand.execute(pactFile, serverInstance);
        })
        .finally(server.stop)
        .fail(function (error) {
            logger.error(error);
            return q.reject(error);
        });
};