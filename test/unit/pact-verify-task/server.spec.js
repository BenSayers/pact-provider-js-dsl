var failTest = require('../support/fail-test');
var requireWithMocks = require('../support/require-with-mocks');

describe('pact-verify-task/server', function () {
    var mockApp;
    var mockBodyParser;
    var mockExpress;
    var mockExpressServer;
    var mockSetUpResource;
    var mockSetUpResourceFactory;
    var server;

    beforeEach(function () {

        mockBodyParser = jasmine.createSpyObj('mockBodyParser',['urlencoded']);
        mockBodyParser.urlencoded.andReturn('urlencoded-bodyparser');

        mockExpressServer = jasmine.createSpyObj('mockExpressServer', ['close']);
        mockExpressServer.close.andCallFake(function (callback) {
            callback();
        });

        mockApp = jasmine.createSpyObj('mockApp', ['listen', 'post', 'use']);
        mockApp.listen.andCallFake(function (port, callback) {
            callback();
            return mockExpressServer;
        });
        mockExpress = jasmine.createSpy('mockExpress').andReturn(mockApp);

        mockSetUpResource = jasmine.createSpy('mockSetUpResource');
        mockSetUpResourceFactory = jasmine.createSpyObj('mockSetUpResourceFactory', ['create']);
        mockSetUpResourceFactory.create.andReturn(mockSetUpResource);

        server = requireWithMocks('./pact-verify-task/server', {
            'express': mockExpress,
            './server/set-up-resource': mockSetUpResourceFactory,
            'body-parser': mockBodyParser
        });
    });

    describe('start', function () {
        it('should start the server on port 8001', function (done) {
            server.start().then(function () {
                expect(mockApp.listen).toHaveBeenCalledWith(8001, jasmine.any(Function));
                done();
            }).fail(failTest(done));
        });

        it('should use bodyparser middleware', function (done) {
            server.start().then(function () {
                expect(mockBodyParser.urlencoded).toHaveBeenCalledWith({extended: false});
                expect(mockApp.use).toHaveBeenCalledWith('urlencoded-bodyparser');
                done();
            }).fail(failTest(done));
        });

        it('should register a POST route to listen for set-up', function (done) {
            var mockStates = {mock: 'states'};

            server.start(mockStates).then(function () {
                expect(mockSetUpResourceFactory.create).toHaveBeenCalledWith(mockStates);
                expect(mockApp.post).toHaveBeenCalledWith('/set-up', mockSetUpResource);
                done();
            }).fail(failTest(done));
        });
    });

    describe('stop', function () {
        it('should stop the server', function (done) {
            server.start().then(server.stop).then(function () {
                expect(mockExpressServer.close).toHaveBeenCalled();
                done();
            }).fail(failTest(done));
        });

        it('should not stop the server when it has not been started', function (done) {
            server.stop().then(function () {
                expect(mockExpressServer.close).not.toHaveBeenCalled();
                done();
            }).fail(failTest(done));
        });
    });
});