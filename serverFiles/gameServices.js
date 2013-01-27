/*jshint node:true*/

module.exports = function () {

var fs = require('fs');
    return {
        getScores: function (request, response, next) {
            var scores = JSON.parse(fs.readFileSync('serverData/highScores.JSON'));
            response.send(scores);
        }
    };
};