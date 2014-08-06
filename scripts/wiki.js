var wikipedia = require("wikipedia-js");
var S = require('string');

module.exports = function(robot) {

  robot.respond(/(?:wikipedia|wiki)(?: me)? (.*)/i, function(msg) {
    options = {query: msg.match[1], format: 'html', summaryOnly: true};
    wikipedia.searchArticle(options, function(err, htmlWikiText) {
      if(err) {
        msg.send('unexpected error: %s', err);
        return;
      }
      if(htmlWikiText) {
        var text = S(htmlWikiText).stripTags().s;
        var firstParagraph = text.split('\n')[0];
        msg.send(firstParagraph);
      }
      else msg.send('no article found');
    });
  });
};
