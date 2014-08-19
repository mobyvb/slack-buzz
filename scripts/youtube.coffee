# Description:
#   Messing around with the YouTube API.
#
# Commands:
#   hubot youtube me <query> - Searches YouTube for the query and returns the top video embed link.
#   hubot youtube me random <query> - Searches YouTube for the query and returns a random video embed link.

module.exports = (robot) ->
  robot.respond /(youtube|yt)( me)?( random)? (.*)/i, (msg) ->
    random = false
    if msg.match[3]
      random = true
    query = msg.match[4]
    robot.http("http://gdata.youtube.com/feeds/api/videos")
      .query({
        orderBy: "relevance"
        'max-results': 15
        alt: 'json'
        q: query
      })
      .get() (err, res, body) ->
        videos = JSON.parse(body)
        videos = videos.feed.entry

        unless videos?
          msg.send "No video results for \"#{query}\""
          return

        video = videos[0]
        if random
          video = msg.random videos
        video.link.forEach (link) ->
          if link.rel is "alternate" and link.type is "text/html"
            msg.send link.href
