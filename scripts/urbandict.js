var http = require('http');

module.exports = function(robot) {

  robot.respond(/(urbandict)( me)? (.*)/i, function(msg) {
    var query = msg.match[3];
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
        var response = definition.word + ':\n';
        response += definition.definition + '\n';
        response += '_' + definition.example + '_\n';
        response += definition.permalink;
        msg.send(response);
      });
    }).on('error', function(e) {
      msg.send('Got error: ' + e.message);
    });
  });
};
