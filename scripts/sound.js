// Description:
//   Commands for Soundcloud
//
// Commands:
//   hubot soundcloud <query> - prints a Soundcloud url that best matches the query

var http = require('http');

module.exports = function(robot) {

    robot.respond(/(?:sound(?:cloud)?)(?: me)? (.*)/i, function(msg) {
        var query = msg.match[1];
        var options = {
            host: 'api.soundcloud.com',
            port: 80,
            path: '/tracks.json?q=' + query.replace(" ", "%20") + '&client_id=2cb63ea0eb1310eadd006fad73c68b75'
        };

        body = "";

        http.get(options, function(res) {
            res.on('data', function(chunk) {
                body += chunk;
            });

            res.on('end', function() {
                body = JSON.parse(body);

                if (!body.length){
                    return msg.send("I didn't find any sounds for \""+query+"\"...");
                }
                msg.send(body[0].permalink_url);
                return;

            });
        });
    });
};
