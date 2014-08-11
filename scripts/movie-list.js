var mongoose = require('mongoose');
var uristring = process.env.MONGOLAB_URI || 'mongodb://localhost/test';
mongoose.connect(uristring);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('connected to mongodb');
});

var movieSchema = mongoose.Schema({
  name: String,
  checked: Boolean
});
var Movie = mongoose.model('Movie', movieSchema);

module.exports = function(robot) {
  robot.respond(/list movies/i, function(msg) {
    Movie.find().sort({checked: 1}).exec(function(err, movies) {
      if(err) return msg.send(error);
      var response = 'Movie List:\n';
      movies.forEach(function(movie) {
        response += movie.checked ? ':heavy_check_mark: ' : '';
        response += movie.name + '\n';
      });
      msg.send(response);
    });
  });
  robot.respond(/(add) (movie) (.*)/i, function(msg) {
    var movieName = msg.match[3];
    Movie.create({ name: movieName, checked: false }, function (err, movie) {
      if (err) return msg.send(err);
      msg.send('Added ' + movie.name + ' to list.');
    });
  });
  robot.respond(/(remove|rm) (movie) (.*)/i, function(msg) {
    var movieName = msg.match[3];
    Movie.remove({ name: movieName }, function (err) {
      if (err) return msg.send(err);
      msg.send('Removed ' + movieName);
    });
  });
  robot.respond(/(check) (movie) (.*)/i, function(msg) {
    var movieName = msg.match[3];
    Movie.update({ name: movieName }, { checked: true }, function(err) {
      if (err) return msg.send(err);
      msg.send('Checked ' + movieName + ' off list.');
    });
  });
  robot.respond(/(uncheck) (movie) (.*)/i, function(msg) {
    var movieName = msg.match[3];
    Movie.update({ name: movieName }, { checked: false }, function(err) {
      if (err) return msg.send(err);
      msg.send('Unchecked ' + movieName + '.');
    });
  });
}
