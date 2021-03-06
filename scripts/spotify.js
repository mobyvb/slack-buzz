// Description:
//   Commands for Spotify
//
// Commands:
//   hubot soundcloud <query> - prints a Spotify url that best matches the query

var http = require('http');

module.exports = function(robot) {

  robot.respond(/(?:spotify)(?: me)? (.*)/i, function(msg) {
    var query = msg.match[1];
    query = query.replace(/\s+/g, "-");

    var options = {
      host: 'ws.spotify.com',
      port: 80,
      path: '/search/1/track.json?q=' + query
    };

    var body = '';

    http.get(options, function(res) {
      res.on('data', function(chunk) {
        body += chunk;
      });

      res.on('end', function() {
        body = JSON.parse(body);
        var songInfo = body.tracks[0];

        if (songInfo != null)
        {
          var URI = songInfo.href;
          var parsedURI = URI.replace('spotify:track:', '');

          var response = 'http://open.spotify.com/track/' + parsedURI;
        }
        else {
          var response = "I couldn't find a song with the title " + query;
        }
        msg.send(response);
      });
    }).on('error', function(e) {
      msg.send('Error: ' + e.message);
    });
  });
};
