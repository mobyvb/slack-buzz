var wikipedia = require("wikipedia-js");
var S = require('string');

module.exports = function(robot) {

  robot.respond(/(wikipedia|wiki)( me)? (.*)/i, function(msg) {
    options = {query: msg.match[3], format: 'html', summaryOnly: true};
    wikipedia.searchArticle(options, function(err, htmlWikiText) {
      if(err) {
        msg.send('unexpected error: %s', err);
        return;
      }
      if(htmlWikiText) msg.send(S(htmlWikiText).stripTags().s);
      else msg.send('no article found');
    });
  });
};
