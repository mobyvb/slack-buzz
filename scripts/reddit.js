// Description:
//   Commands for Reddit

var http = require('http');
var parser = require('xml2js').Parser();

module.exports = function(robot){
  robot.hear(/(?:\/)(r|u)(?:\/)(.*)/i, function(msg){
    type = msg.match[1]
    query = msg.match[2];

    if(query.split(" ").length > 1) {
      searchon = query.split(" ")[1];
      query = query.split(" ")[0];
    }else {
      searchon = "";
    }

    if((searchon != "") && (["hot",
                    "new",
                    "rising",
                    "controversial",
                    "top",
                    "gilded"].indexOf(searchon) != -1)) {
      addtopath = "/"+searchon;
      addtoheader = " on "+searchon;
    }else {
      addtopath = "";
      addtoheader = "";
    }

    //is it sub or user?
    if(type == 'r'){
      //is it subreddit or thread?
      if ((query.split('/').length - 1) > 1){
        //it's a thread

        options = {
          host: 'api.reddit.com',
          port: 80,
          path: "/r/"+query+addtopath+".xml"
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

              message = "*"+post_title+"*\n( "+post_link+" )";
              if(post_desc){

                if(post_desc.split("p>").length > 1) {
                  post_desc = post_desc.split("p>")[1].replace("</", "");
                }else if(post_desc.split("a href=\"").length > 1){
                  post_desc = post_desc.split("a href=\"")[3].split("\"")[0];
                }

                post_desc = post_desc.replace("&quot;", "\"")
                                      .replace("&nbsp;", " ")
                                      .replace("<br/>", "\n")
                                      .replace("&#39;", "\'");

                message += "\n*Description*:\n> _ "+post_desc+" _";
              }
              message += "\n*Top Comment* by "+topcomm_title+":";
              message += "\n> _ "+topcomm_desc+" _";

              msg.send(message);
            });
          });

        });

      }else {
        //it's a subreddit

        options = {
          host: 'api.reddit.com',
          port: 80,
          path: '/r/'+query+addtopath+".xml"
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

                    message = subreddit_link;
                    message += "\n_ "+subreddit_desc+" _";
                    message += "\nTop Post"+addtoheader+": *"+toppost_name+"*\n( "+toppost_link+" )";

                    if(toppost_desc.split("p>").length > 1) {
                      toppost_desc = toppost_desc.split("p>")[1].replace("</", "");
                    }else if(toppost_desc.split("a href=\"").length > 1){
                      toppost_desc = toppost_desc.split("a href=\"")[3].split("\"")[0];
                    }

                    toppost_desc = toppost_desc.replace("&quot;", "\"")
                                          .replace("&nbsp;", " ")
                                          .replace("<br/>", "\n")
                                          .replace("&#39;", "\'");

                    if(result.rss.channel[0].item[1]){
                      topcomm_title = result.rss.channel[0].item[1].title[0];
                      topcomm_title = (topcomm_title.split(" ")[0]).replace(/_/g, "\\_");
                      topcomm_desc = result.rss.channel[0].item[1].description[0];

                      message += "\n*Description*:\n> _ "+toppost_desc+" _";
                      message += "\n*Top Comment* by "+topcomm_title+":";
                      message += "\n> _ "+topcomm_desc+" _";
                      message += "\nall comments: "+toppost_guid+"";
                    }else {
                      message += "\n*Description*:\n> _ "+toppost_desc+" _";
                      message += "\n*No Comments*";
                    }
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
