var requireWithMocks = require('../support/require-with-mocks');

describe('pact-verify-task/logger', function () {
    var logger;
    var mockConsole;

    beforeEach(function () {
        mockConsole = jasmine.createSpyObj('mockConsole', ['error']);
        logger = requireWithMocks('./pact-verify-task/logger', {
            'console': mockConsole
        });
    });

    it('should log errors to stderr', function () {
        var error = new Error('Failed');
        error.stack = 'a-stack-trace';
        logger.error(error);

        expect(mockConsole.error).toHaveBeenCalledWith('pact-provider-js-dsl error:', 'Failed', 'a-stack-trace');
    });
});