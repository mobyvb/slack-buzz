// Description:
//   Commands for Wikipedia
//
// Commands:
//   hubot wiki <query> - finds an article from Wikipedia based on the query and posts the first paragraph

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
        if(text.search(/(refer|refers) to:/) === -1) {
          text = text.split('\n')[0];
        }
        msg.send(text);
      }
      else msg.send('no article found');
    });
  });
};
