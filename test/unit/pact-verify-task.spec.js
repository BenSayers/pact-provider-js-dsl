var failTest = require('./support/fail-test');
var requireWithMocks = require('./support/require-with-mocks');
var q = require('q');

describe('pact-verify-task', function () {
    var mockLogger;
    var mockPath;
    var pactVerifyTask;
    var mockPactStateReader;
    var mockServer;
    var mockPactVerifyRubyCommand;

    beforeEach(function () {
        mockLogger = jasmine.createSpyObj('mockLogger', ['error']);

        mockPath = jasmine.createSpyObj('mockPath', ['resolve']);

        mockPactStateReader = jasmine.createSpyObj('mockPactStateReader',['processHelper']);
        mockPactStateReader.processHelper.andReturn(q());

        mockServer = jasmine.createSpyObj('mockServer', ['start', 'stop']);
        mockServer.start.andReturn(q());
        mockServer.stop.andReturn(q());

        mockPactVerifyRubyCommand = jasmine.createSpyObj('mockPactVerifyRubyCommand', ['execute']);

        pactVerifyTask = requireWithMocks('./pact-verify-task', {
            'path': mockPath,
            './pact-verify-task/logger': mockLogger,
            './pact-verify-task/pact-state-reader': mockPactStateReader,
            './pact-verify-task/pact-verify-ruby-command': mockPactVerifyRubyCommand,
            './pact-verify-task/server': mockServer
        });
    });

    var invokePactVerifyTask = function () {
        return pactVerifyTask('pactFile.json', 'pactHelper.js');
    };

    var getMostRecentLoggedErrorMessageOrUndefined = function () {
        var mostRecentCallArguments = mockLogger.error.mostRecentCall.args || [];
        var error = mostRecentCallArguments[0] || {};
        return error.message;
    };

    var itShouldLogTheError = function (expectedMessage, done) {
        invokePactVerifyTask().then(failTest(done), function (actualError) {
            expect(actualError.message).toBe(expectedMessage);
            expect(mockLogger.error).toHaveBeenCalled();
            expect(getMostRecentLoggedErrorMessageOrUndefined()).toBe(expectedMessage, 'the error logged');
            done();
        });
    };

    it('should retrieve the states from the pact helper', function (done) {
        mockPath.resolve.andCallFake(function () {

        });

        invokePactVerifyTask().then(function () {
            expect(mockPactStateReader.processHelper).toHaveBeenCalledWith('pactHelper.js');
            done();
        }).fail(failTest(done));
    });

    it('should log the error if retrieving the states fails', function (done) {
        mockPactStateReader.processHelper.andReturn(q.reject(new Error('Failed')));

        itShouldLogTheError('Failed', done);
    });

    it('should spin up the state change proxy server', function (done) {
        mockPactStateReader.processHelper.andReturn(q('pact-helper-states'));

        invokePactVerifyTask().then(function () {
            expect(mockServer.start).toHaveBeenCalledWith('pact-helper-states');
            done();
        }).fail(failTest(done));
    });

    it('should log the error if spinning up the proxy server', function (done) {
        mockServer.start.andReturn(q.reject(new Error('Failed')));

        itShouldLogTheError('Failed', done);
    });

    it('should run the pact verify ruby command', function (done) {
        mockServer.start.andReturn(q({server: 'instance'}));

        invokePactVerifyTask().then(function () {
            expect(mockPactVerifyRubyCommand.execute).toHaveBeenCalledWith('pactFile.json', {server: 'instance'});
            done();
        }).fail(failTest(done));
    });

    it('should log the error if running the ruby command fails', function (done) {
        mockPactVerifyRubyCommand.execute.andReturn(q.reject(new Error('Failed')));

        itShouldLogTheError('Failed', done);
    });

    it('should stop the state change server if the ruby command fails', function (done) {
        mockPactVerifyRubyCommand.execute.andReturn(q.reject(new Error('Failed')));

        invokePactVerifyTask().then(failTest(done), function () {
            expect(mockServer.stop).toHaveBeenCalled();
            done();
        });
    });

    it('should stop the state change proxy server', function (done) {
        invokePactVerifyTask().then(function () {
            expect(mockServer.stop).toHaveBeenCalled();
            done();
        }).fail(failTest(done));
    });

    it('should log the error if stopping the server fails', function (done) {
        mockServer.stop.andReturn(q.reject(new Error('Failed')));

        itShouldLogTheError('Failed', done);
    });
});