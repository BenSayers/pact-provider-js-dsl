var requireWithMocks = require('../../support/require-with-mocks');

describe('pact-verify-task/pact-state-reader/dsl', function () {
    var dsl;

    beforeEach(function () {
        dsl = requireWithMocks('./pact-verify-task/pact-state-reader/dsl');
    });

    it('should allow a set up callback to be registered for a consumers state', function () {
        var setUpCallback = jasmine.createSpy('setUpCallback');

        dsl.providerStatesFor('consumer1', function () {
            this.providerState('state1', function () {
                this.setUp(setUpCallback);
            });
        });

        var states = dsl.getStates();

        expect(states.consumer1).toEqual(jasmine.any(Object), 'states.consumer1');
        expect(states.consumer1.state1)
            .toEqual(jasmine.objectContaining({setUp: setUpCallback}), 'states.consumer1.state1');
    });

    it('should allow multiple states for the same consumer to be registered', function () {
        var setUpForState1 = jasmine.createSpy('setUpForState1');
        var setUpForState2 = jasmine.createSpy('setUpForState2');

        dsl.providerStatesFor('consumer1', function () {
            this.providerState('state1', function () {
                this.setUp(setUpForState1);
            });

            this.providerState('state2', function () {
                this.setUp(setUpForState2);
            });
        });

        var states = dsl.getStates();

        expect(states.consumer1.state1)
            .toEqual(jasmine.objectContaining({setUp: setUpForState1}), 'states.consumer1.state1');
        expect(states.consumer1.state2)
            .toEqual(jasmine.objectContaining({setUp: setUpForState2}), 'states.consumer1.state2');
    });

    it('should allow multiple consumers to be registered', function () {
        var setUpForConsumer1 = jasmine.createSpy('setUpForConsumer1');
        var setUpForConsumer2 = jasmine.createSpy('setUpForConsumer2');

        dsl.providerStatesFor('consumer1', function () {
            this.providerState('state1', function () {
                this.setUp(setUpForConsumer1);
            });
        });

        dsl.providerStatesFor('consumer2', function () {
            this.providerState('state1', function () {
                this.setUp(setUpForConsumer2);
            });
        });

        var states = dsl.getStates();

        expect(states.consumer1.state1)
            .toEqual(jasmine.objectContaining({setUp: setUpForConsumer1}), 'states.consumer1.state1');
        expect(states.consumer2.state1)
            .toEqual(jasmine.objectContaining({setUp: setUpForConsumer2}), 'states.consumer2.state1');
    });

    it('should allow multiple states for the same consumer to be registered individually', function () {
        var setUpForState1 = jasmine.createSpy('setUpForState1');
        var setUpForState2 = jasmine.createSpy('setUpForState2');

        dsl.providerStatesFor('consumer1', function () {
            this.providerState('state1', function () {
                this.setUp(setUpForState1);
            });
        });

        dsl.providerStatesFor('consumer1', function () {
            this.providerState('state2', function () {
                this.setUp(setUpForState2);
            });
        });

        var states = dsl.getStates();

        expect(states.consumer1.state1)
            .toEqual(jasmine.objectContaining({setUp: setUpForState1}), 'states.consumer1.state1');
        expect(states.consumer1.state2)
            .toEqual(jasmine.objectContaining({setUp: setUpForState2}), 'states.consumer1.state2');
    });

    it('should let exceptions thrown by the providerState callback bubble up', function () {
        var thisWillFail = function() {
            dsl.providerStatesFor('consumer1', function () {
                this.providerState('state1', function () {
                    throw new Error('an-error-message');
                });
            });
        };

        expect(thisWillFail).toThrow(new Error('an-error-message'));
    });

    it('should let exceptions thrown by the providerStatesFor callback bubble up', function () {
        var thisWillFail = function() {
            dsl.providerStatesFor('consumer1', function () {
                throw new Error('an-error-message');
            });
        };

        expect(thisWillFail).toThrow(new Error('an-error-message'));
    });

});