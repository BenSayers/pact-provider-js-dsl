var q = require('q');

module.exports = {
    create: function () {
        return function (request, response) {
            response.status(200);
            response.end();
            return q();
        };
    }
};