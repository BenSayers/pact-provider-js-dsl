var console = require('console');

module.exports = {
    error: function (error) {
        console.error('pact-provider-js-dsl error:', error.message, error.stack);
    }
};