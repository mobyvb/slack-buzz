var http = require('http');
var parser = require('xml2js').Parser();

module.exports = function(robot){
  robot.hear(/(?:\/)(r|u)(?:\/)(.*)(?:\s)?/i, function(msg){
    type = msg.match[1]
    query = msg.match[2];

    //is it sub or user?
    if(type == 'r'){
      //is it subreddit or thread?
      if ((query.split('/').length - 1)){
        //it's a thread

        options = {
          host: 'api.reddit.com',
          port: 80,
          path: "/r/"+query+".xml"
        };

        comm_body = "";

        http.get(options, function(res){
          res.on('data', function(chunk) {
            comm_body += chunk;
          });

          res.on('end', function() {
            parser.parseString(comm_body, function(err, result) {
              if(err) {
                return msg.send(err);
              }

              post_title = result.rss.channel[0].item[0].title[0];
              post_link = result.rss.channel[0].item[0].link[0];
              post_desc = result.rss.channel[0].item[0].description[0];

              topcomm_title = result.rss.channel[0].item[1].title[0];
              topcomm_title = (topcomm_title.split(" ")[0]).replace(/_/g, "\\_");
              topcomm_desc = result.rss.channel[0].item[1].description[0];

              message = "[*"+post_title+"*]("+post_link+")";
              if(post_desc){

                if(post_desc.split("p>").length > 1) {
                  post_desc = post_desc.split("p>")[1].replace("</", "");
                }else if(post_desc.split("a href=\"").length > 1){
                  post_desc = post_desc.split("a href=\"")[3].split("\"")[0];
                }

                message += "\n_Desc_: "+post_desc;
              }
              message += "\nTop Comment by _"+topcomm_title+"_:";
              message += "\n"+topcomm_desc;

              msg.send(message);
            });
          });

        });

      }else {
        //it's a subreddit

        options = {
          host: 'api.reddit.com',
          port: 80,
          path: '/r/'+query+".xml"
        };

        body = "";

        http.get(options, function(res) {
          res.on('data', function(chunk) {
            body += chunk;
          });

          res.on('end', function() {
            parser.parseString(body, function (err, result) {
              if(err){
                return msg.send(err);
              }

              subreddit_title = result.rss.channel[0].title[0];
              subreddit_link = result.rss.channel[0].link[0];
              subreddit_desc = result.rss.channel[0].description[0];

              toppost_name = result.rss.channel[0].item[0].title[0];
              toppost_link = result.rss.channel[0].item[0].link[0];
              toppost_guid = result.rss.channel[0].item[0].guid[0]._;
              toppost_desc = result.rss.channel[0].item[0].description[0];

              toppost_tocomm = toppost_guid;
              (""+toppost_tocomm).replace(/http(s)?(www.)?reddit.com/, "");

              options = {
                host: 'api.reddit.com',
                port: 80,
                path: ""+toppost_tocomm+".xml"
              };

              comm_body = "";

              http.get(options, function(res){
                res.on('data', function(chunk) {
                  comm_body += chunk;
                });

                res.on('end', function() {
                  parser.parseString(comm_body, function(err, result) {
                    if(err) {
                      return msg.send(err);
                    }

                    message = "[/r/*"+subreddit_title+"*]("+subreddit_link+")";
                    message += "\n_"+subreddit_desc+"_";
                    message += "\nTop Post: ["+toppost_name+"]("+toppost_link+")";

                    if(toppost_desc.split("p>").length > 1) {
                      toppost_desc = toppost_desc.split("p>")[1].replace("</", "");
                    }else if(toppost_desc.split("a href=\"").length > 1){
                      toppost_desc = toppost_desc.split("a href=\"")[3].split("\"")[0];
                    }

                    topcomm_title = result.rss.channel[0].item[1].title[0];
                    topcomm_title = (topcomm_title.split(" ")[0]).replace(/_/g, "\\_");
                    topcomm_desc = result.rss.channel[0].item[1].description[0];

                    message += "\n_Desc_: "+toppost_desc;
                    message += "\nTop Comment by _"+topcomm_title+"_: ([_all comments_]("+toppost_guid+"))";
                    message += "\n"+topcomm_desc;
                    message += "\n";

                    msg.send(message);
                  });
                });

              });

            });
          });
        });
      }
    }else if(type == 'u'){
      msg.send("I can't check on reddit users yet...");
    }
  });
};
