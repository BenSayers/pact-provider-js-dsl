var failTest = require('../support/fail-test');
var q = require('q');
var requireWithMocks = require('../support/require-with-mocks');

describe('pact-verify-task/pact-verify-ruby-command', function () {
    var mockCommandExecutor;
    var mockPath;
    var mockPathToProjectRoot;
    var pactVerifyRubyCommand;

    beforeEach(function () {
        mockCommandExecutor = jasmine.createSpyObj('mockCommandExecutor', ['execute']);
        mockCommandExecutor.execute.andReturn(q());

        mockPath = jasmine.createSpyObj('mockPath', ['resolve']);

        mockPathToProjectRoot = jasmine.createSpy('mockPathToProjectRoot').andReturn('');

        pactVerifyRubyCommand = requireWithMocks('./pact-verify-task/pact-verify-ruby-command', {
            'path': mockPath,
            './pact-verify-ruby-command/command-executor': mockCommandExecutor,
            './pact-verify-ruby-command/path-to-project-root': mockPathToProjectRoot
        });
    });

    it('should install the pact-verify dependencies using bundler', function (done) {
        mockPathToProjectRoot.andReturn('working-dir');

        pactVerifyRubyCommand.execute('pact-file.json').then(function () {
            expect(mockCommandExecutor.execute).toHaveBeenCalledWith('bundle install --deployment', 'working-dir');
            done();
        }).fail(failTest(done));
    });

    it('should return the error when installing the dependencies fails', function (done) {
        mockCommandExecutor.execute.andReturn(q.reject(new Error('broken')));

        pactVerifyRubyCommand.execute('pact-file.json').then(failTest(done)).fail(function (error) {
            expect(error).toBeDefined();
            expect(error.message).toBe('broken');
            done();
        });
    });

    var absolutePathToPactFile = '/absolute/path/to/pact-file.json';
    var pactVerifyCommand = 'bundle exec rake pact:verify:javascript --pactFile=/absolute/path/to/pact-file.json';

    it('should run the pact verify', function (done) {
        mockPathToProjectRoot.andReturn('working-dir');
        mockPath.resolve.andReturn(absolutePathToPactFile);

        pactVerifyRubyCommand.execute('pact-file.json').then(function () {
            expect(mockPath.resolve).toHaveBeenCalledWith('pact-file.json');
            expect(mockCommandExecutor.execute).toHaveBeenCalledWith(pactVerifyCommand, 'working-dir');
            done();
        }).fail(failTest(done));
    });

    it('should return the error when running pact verify fails', function (done) {
        mockCommandExecutor.execute.andCallFake(function (command) {
            return (command === pactVerifyCommand) ? q.reject(new Error('broken')) : q();
        });
        mockPath.resolve.andReturn(absolutePathToPactFile);

        pactVerifyRubyCommand.execute('pact-file.json').then(failTest(done)).fail(function (error) {
            expect(error).toBeDefined();
            expect(error.message).toBe('broken');
            done();
        });
    });
});