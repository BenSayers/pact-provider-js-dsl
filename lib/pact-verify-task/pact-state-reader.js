var q = require('q');
var dsl = require('./pact-state-reader/dsl');
var path = require('path');

var loadPactHelper = function (pactHelper) {
    try {
        return q(require(path.resolve(pactHelper)));
    } catch (ex) {
        return q.reject(new Error('The pact file "' + pactHelper + '" cannot be found'));
    }
};

module.exports = {
    processHelper: function (pactHelper) {
        return loadPactHelper(pactHelper).then(function (pactHelperInstance) {
            pactHelperInstance(dsl);
            return q(dsl.getStates());
        });
    }
};