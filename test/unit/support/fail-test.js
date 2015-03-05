var _ = require('lodash');

module.exports = function (doneCallback) {
    return function (error) {
        expect('The promise').toBe('in the opposite state');
        if (_.isError(error)) {
            expect(error.message).toBeFalsy();
        } else {
            expect(JSON.stringify(arguments)).toBeFalsy();
        }

        doneCallback();
    };
};