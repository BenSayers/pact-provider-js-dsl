var failTest = require('../../support/fail-test');
var requireWithMocks = require('../../support/require-with-mocks');

describe('pact-verify-task/server/set-up-resource', function () {
    var mockRequest;
    var mockResponse;
    var setUpResource;

    beforeEach(function () {
        mockRequest = {};
        mockResponse = jasmine.createSpyObj('mockResponse', ['end', 'status']);
        setUpResource = requireWithMocks('./pact-verify-task/server/set-up-resource');
    });

    it('should create an instance of the resource', function () {
        expect(setUpResource.create()).toEqual(jasmine.any(Function));
    });

    it('should call the setUp method for the state specified', function () {

    });

    it('should return a http 200', function (done) {
        var setUpResourceInstance = setUpResource.create();
        setUpResourceInstance(mockRequest, mockResponse).then(function () {
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.end).toHaveBeenCalled();
            done();
        }).fail(failTest(done));
    });
});