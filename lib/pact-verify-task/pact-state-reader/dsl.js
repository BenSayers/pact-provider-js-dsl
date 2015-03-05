var _ = require('lodash');
var states = {};

module.exports = {
    providerStatesFor: function (consumerName, providerStateSetup) {
        var statesForConsumer = {};

        var providerStatesApi = {
            providerState: function (state, providerStateFn) {
                var stateApi = {
                    setUp: function (setUpFn) {
                        statesForConsumer[state] = {};
                        statesForConsumer[state].setUp = setUpFn;
                    }
                };

                providerStateFn.apply(stateApi);
            }
        };

        providerStateSetup.apply(providerStatesApi);

        states[consumerName] = _.extend({}, states[consumerName], statesForConsumer);
     },
    getStates: function () {
        return states;
    }
};