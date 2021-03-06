// Description:
//   Commands for Urban Dictionary
//
// Commands:
//   hubot urbandict <term> - prints the top rated Urbandict definition and example for a term

var http = require('http');

module.exports = function(robot) {


  robot.respond(/(?:urbandict)(?: me)? (.*)/i, function(msg) {
    var query = msg.match[1];
    query=query.replace(/\s+/g, "-")

    var options = {
      host: 'api.urbandictionary.com',
      port: 80,
      path: '/v0/define?term=' + query
    };
    var body = '';
    http.get(options, function(res) {
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        body = JSON.parse(body);
        var list = body.list;
        if(!list.length) {
          return msg.send('I didn\'t find a definition for "' + query + '"');
        }
        var definition = body.list[0];
        var response = '*' + definition.word + '*' + ':\n';
        response += definition.definition + '\n';
        definition.example = definition.example.replace(/\r\n/g, '_\n_');
        response += '_' + definition.example + '_\n';
        response += definition.permalink + '\n';
        response += 'Definition submitted by ' + definition.author;
        msg.send(response);
      });
    }).on('error', function(e) {
      msg.send('Got error: ' + e.message);
    });
  });
};
