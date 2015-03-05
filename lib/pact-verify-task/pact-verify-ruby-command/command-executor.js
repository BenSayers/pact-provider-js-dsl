var childProcess = require('child_process');
var logger = require('../logger');
var q = require('q');

module.exports = {
    execute: function (command, workingDirectory) {
        var deferred = q.defer();

        childProcess.exec(command, {cwd: workingDirectory}, function (error, stderr, stdout) {
            logger.info(stdout.toString());

            if (error) {
                logger.error(stderr.toString());
                deferred.reject(error);
            } else if (stderr.length > 0) {
                logger.error(stderr.toString());
                deferred.reject(new Error('Executing the command "' + command + '" returned an error'));
            } else {
                deferred.resolve();
            }
        });

        return deferred.promise;
    }
};