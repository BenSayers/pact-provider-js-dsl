var failTest = require('../../support/fail-test');
var requireWithMocks = require('../../support/require-with-mocks');

describe('pact-verify-task/pact-verify-ruby-command/command-executor', function () {
    var execError;
    var execStderr;
    var execStdout;
    var mockChildProcess;
    var mockLogger;
    var commandExecutor;

    beforeEach(function () {
        execError = null;
        execStderr = new Buffer('');
        execStdout = new Buffer('');
        mockChildProcess = jasmine.createSpyObj('mockChildProcess', ['exec']);
        mockChildProcess.exec.andCallFake(function (command, options, callback) {
            callback(execError, execStderr, execStdout);
        });

        mockLogger = jasmine.createSpyObj('mockLogger', ['error', 'info']);

        commandExecutor = requireWithMocks('./pact-verify-task/pact-verify-ruby-command/command-executor', {
            'child_process': mockChildProcess,
            '../logger': mockLogger
        });
    });

    var invokeExecute = function (command, workingDirectory) {
        return commandExecutor.execute(command || 'default-command', workingDirectory || '/default-working-directory');
    };

    it('should execute the command', function (done) {
        invokeExecute('command', '/working-directory').then(function () {
            expect(mockChildProcess.exec).toHaveBeenCalledWith(
                'command',
                {cwd: '/working-directory'},
                jasmine.any(Function)
            );
            done();
        }).fail(failTest(done));
    });

    it('should log the stdout of the command', function (done) {
        execStdout = new Buffer('stdout');

        invokeExecute().then(function () {
            expect(mockLogger.info).toHaveBeenCalledWith('stdout');
            done();
        }).fail(failTest(done));
    });

    describe('when an error occurs', function () {
        it('should return the error', function (done) {
            execError = new Error('the-error-message');

            invokeExecute().then(failTest(done), function (error) {
                expect(error).toBeDefined('the error');
                expect(error.message).toBe('the-error-message');
                done();
            });
        });

        it('should log the stdout of the command as an error', function (done) {
            execError = new Error();
            execStdout = new Buffer('stdout');

            invokeExecute().then(failTest(done), function () {
                expect(mockLogger.info).toHaveBeenCalledWith('stdout');
                done();
            });
        });

        it('should log the stderr of the command as an error', function (done) {
            execError = new Error();
            execStderr = new Buffer('stderr');

            invokeExecute().then(failTest(done), function () {
                expect(mockLogger.error).toHaveBeenCalledWith('stderr');
                done();
            });
        });

        it('should return an error when there is any stderr from the command', function (done) {
            execStderr = new Buffer('stderr');

            invokeExecute('the-command').then(failTest(done), function (error) {
                expect(error).toBeDefined('the error');
                expect(error.message).toBe('Executing the command "the-command" returned an error');
                done();
            });
        });
    });
});