var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

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
  robot.respond(/movie list/i, function(msg) {
    Movie.find(function(err, movies) {
      if(err) return msg.send(error);
      msg.send('Movie List:\n' + movies);
    });
  });
  robot.respond(/(add) (movie) (.*)/i, function(msg) {
    var movieName = msg.match[3];
    var newMovie = new Movie({ name: movieName, checked: false });
    newMovie.save(function() {
      msg.send('hello');
      msg.send(newMovie);
    });
  });
  robot.respond(/(remove|rm) (movie) (.*)/i, function(msg) {

  });
  robot.respond(/(check) (movie) (.*)/i, function(msg) {

  });
}
