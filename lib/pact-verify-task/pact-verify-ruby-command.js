var commandExecutor = require('./pact-verify-ruby-command/command-executor');
var path = require('path');
var pathToProjectRoot = require('./pact-verify-ruby-command/path-to-project-root');

var executeCommand = function (command) {
    return commandExecutor.execute(command, pathToProjectRoot());
};

module.exports = {
    execute: function (pactFile) {
        var absolutePactFile = path.resolve(pactFile);
        return executeCommand('bundle install --deployment').then(function () {
            return executeCommand('bundle exec rake pact:verify:javascript --pactFile=' + absolutePactFile);
        });
    }
};