// Description:
//   Commands for book list
//
// Commands:
//   hubot list books - prints out a list of books that have been added to the list
//   hubot add book <book> - adds a book to the list
//   hubot remove book <book> - removes a book from the list
//   hubot check book <book> - checks book off the list
//   hubot uncheck book <book> - unchecks book

var mongoose = require('mongoose');
var uristring = process.env.MONGOLAB_URI || 'mongodb://localhost/test';
mongoose.connect(uristring);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('connected to mongodb');
});

var bookSchema = mongoose.Schema({
  name: String,
  checked: Boolean
});
var Book = mongoose.model('Book', bookSchema);

module.exports = function(robot) {
  robot.respond(/list books/i, function(msg) {
    Book.find().sort({checked: 1}).exec(function(err, books) {
      if(err) return msg.send(error);
      var response = 'Book List:\n';
      books.forEach(function(book) {
        response += book.checked ? ':heavy_check_mark: ' : '';
        response += book.name + '\n';
      });
      msg.send(response);
    });
  });
  robot.respond(/(add) (book) (.*)/i, function(msg) {
    var bookName = msg.match[3];
    Book.create({ name: bookName, checked: false }, function (err, book) {
      if (err) return msg.send(err);
      msg.send('Added ' + book.name + ' to list.');
    });
  });
  robot.respond(/(remove|rm) (book) (.*)/i, function(msg) {
    var bookName = msg.match[3];
    Book.remove({ name: bookName }, function (err) {
      if (err) return msg.send(err);
      msg.send('Removed ' + bookName);
    });
  });
  robot.respond(/(check) (book) (.*)/i, function(msg) {
    var bookName = msg.match[3];
    Book.update({ name: bookName }, { checked: true }, function(err) {
      if (err) return msg.send(err);
      msg.send('Checked ' + bookName + ' off list.');
    });
  });
  robot.respond(/(uncheck) (book) (.*)/i, function(msg) {
    var bookName = msg.match[3];
    Book.update({ name: bookName }, { checked: false }, function(err) {
      if (err) return msg.send(err);
      msg.send('Unchecked ' + bookName + '.');
    });
  });
}
