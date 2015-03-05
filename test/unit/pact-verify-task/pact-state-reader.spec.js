var failTest = require('../support/fail-test');
var requireWithMocks = require('../support/require-with-mocks');

describe('pact-verify-task/pact-state-reader', function () {
    var mockDsl;
    var mockPath;
    var mockProviderPactHelper;
    var pactStateReader;

    beforeEach(function () {
        mockDsl = jasmine.createSpyObj('dsl', ['getStates']);
        mockDsl.getStates.andReturn('');
        mockPath = jasmine.createSpyObj('mockPath', ['resolve']);
        mockPath.resolve.andCallFake(function (path) {
            return path;
        });
        mockProviderPactHelper = jasmine.createSpy('mockProviderPactHelper');
        pactStateReader = requireWithMocks('./pact-verify-task/pact-state-reader', {
            './pact-state-reader/dsl': mockDsl,
            './provider-pact-helper': mockProviderPactHelper,
            'path': mockPath
        });
    });

    it('should load the pact helper using its absolute path', function (done) {
        mockPath.resolve.andReturn('./provider-pact-helper');
        pactStateReader.processHelper('../../provider-pact-helper').then(function () {
            done();
        }).fail(failTest(done));
    });

    it('should invoke the pact helper with the dsl', function (done) {
        pactStateReader.processHelper('./provider-pact-helper').then(function () {
            expect(mockProviderPactHelper).toHaveBeenCalledWith(mockDsl);
            done();
        }).fail(failTest(done));
    });

    it('should return the error when the pact helper does not exist', function (done) {
        pactStateReader.processHelper('./missing-pact-file').then(failTest(done), function (error) {
            expect(error.message).toBe('The pact file "./missing-pact-file" cannot be found');
            done();
        });
    });

    it('should return an error if the pactHelperInstance throws an error', function (done) {
        mockProviderPactHelper.andThrow(new Error('some-error'));

        pactStateReader.processHelper('./provider-pact-helper').then(failTest(done), function (error) {
            expect(error.message).toBe('some-error');
            done();
        });
    });

    it('should return the extracted states from the dsl', function (done) {
        mockDsl.getStates.andReturn('provider-states');

        pactStateReader.processHelper('./provider-pact-helper').then(function (providerStates) {
            expect(mockDsl.getStates).toHaveBeenCalled();
            expect(providerStates).toBe('provider-states');
            done();
        }).fail(failTest(done));
    });

    it('should return an error if the dsl.getStates throws an error', function (done) {
        mockDsl.getStates.andThrow(new Error('another-error'));

        pactStateReader.processHelper('./provider-pact-helper').then(failTest(done), function(error) {
           expect(error.message).toBe('another-error');
            done();
        });
    });
});