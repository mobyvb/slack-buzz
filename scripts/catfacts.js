// Description:
//   Commands for catfacts
//
// Commands:
//   hubot catfacts - displays a random catfact

var http = require('http');

module.exports = function(robot) {
  robot.hear(/(\s|^)(cat|cats|kitten|kittens)(\s|$|\.|,)/i, function(msg){
    getCatFact(function(fact) {
      msg.send(fact);
    });
  });

  robot.respond(/(?:catfact)/i, function(msg) {
    getCatFact(function(fact) {
      msg.send(fact);
    });
  });
};

function getCatFact(cb) {
  var body = '';
  http.get('http://catfacts-api.appspot.com/api/facts', function(res) {
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      body = JSON.parse(body);
      var fact = 'Thank you for subscribing to catfacts!\n' + body.facts;
      cb(fact);
    });
  }).on('error', function(e) {
    cb('Got error: ' + e.message);
  });
}
