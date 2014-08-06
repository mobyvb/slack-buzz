var http = require('http');

module.exports = function(robot) {

  robot.respond(/(current|random)? (xkcd)( me)?( )?(.*)?/i, function(msg) {
    var current = msg.match[1]==='current' ? true : false;
    var comicNum = msg.match[5];
    if(comicNum) {
      return getComic(comicNum, function(message) {
        msg.send(message);
      });
    }
    var options = {
      host: 'xkcd.com',
      port: 80,
      path: '/info.0.json'
    };
    var body = '';
    http.get(options, function(res) {
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        var latest = JSON.parse(body).num;
        if(current) {
          return getComic(latest, function(message) {
            msg.send(message);
          });
        }
        comicNum = ~~(Math.random()*latest + 1);
        getComic(comicNum, function(message) {
          msg.send(message);
        });
      });
    }).on('error', function(e) {
      msg.send('Got error: ' + e.message);
    });
  });
};

function getComic(comicNum, cb) {
  var options = {
    host: 'xkcd.com',
    port: 80,
    path: '/'+comicNum+'/info.0.json'
  };

  var body = '';
  http.get(options, function(res) {
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      var comic = JSON.parse(body);
      var message = '*xkcd comic ' + comic.num + ':*\n';
      message += '*' + comic.title + '*\n';
      message += comic.img + '\n';
      message += '_' + comic.alt + '_';

      cb(message);
    });
  }).on('error', function(e) {
    cb('Got error: ' + e.message);
  });
}
