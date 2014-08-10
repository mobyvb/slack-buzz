var ical = require('ical');
var url = 'https://www.google.com/calendar/ical/p1cujmvr6fqk5pfcgkiihpaldo%40group.calendar.google.com/public/basic.ics';

module.exports = function(robot) {
  robot.respond(/(upcoming events)/i, function(msg) {
    getEventsNear(new Date(), function(response) {
      msg.send(response);
    });
  });
  robot.respond(/(when is|when are)( the)? (.*)/i, function(msg) {
    var query = msg.match[3];
    findEvent(query, function(response) {
      msg.send(response);
    });
  });
}

function getEventsNear(date, cb) {
  var events = [];
  var startDate = date.getTime();
  date.setDate(date.getDate()+14);
  var endDate = date.getTime();
  ical.fromURL(url, {}, function(err, data) {
    for (var k in data) {
      if (data.hasOwnProperty(k)) {
        var ev = data[k];
        if(ev.start) {
          var d = new Date(ev.start).getTime();
          if(d > startDate && d < endDate) {
            events.push(ev);
          }
        }
      }
    }

    events.sort(function(a, b) {
      return a.start - b.start;
    });

    var responseStr = '';
    events.forEach(function(event) {
      var start = (event.start.getMonth()+1) + '/' + event.start.getDate() + '/' + event.start.getFullYear();
      var end = (event.end.getMonth()+1) + '/' + event.end.getDate() + '/' + event.end.getFullYear();
      responseStr += '*' + event.summary + ':*\n';
      responseStr += '_' + start + ' - ' + end + '_\n';
      responseStr += event.description + '\n\n';
    });
    cb(responseStr);
  });
}

function findEvent(query, cb) {
  query = query.replace(/\W/g, '').toLowerCase();
  query = query.replace('bday', 'birthday');
  var events = [];
  ical.fromURL(url, {}, function(err, data) {
    for (var k in data) {
      if (data.hasOwnProperty(k)) {
        var ev = data[k];
        if(ev.summary || ev.description) {
          var match = false;
          var summary = ev.summary.replace(/\W/g, '').toLowerCase();
          var description = ev.description.replace(/\W/g, '').toLowerCase();
          summary = summary.replace('bday', 'birthday');
          description = description.replace('bday', 'birthday');
          if(summary.indexOf(query)!==-1 || description.indexOf(query)!==-1) {
            if(ev.start >= Date.now()) {
              events.push(ev);
            }
          }
        }
      }
    }

    events.sort(function(a, b) {
      return a.start - b.start;
    });

    var responseStr = '';
    events.forEach(function(event) {
      var start = (event.start.getMonth()+1) + '/' + event.start.getDate() + '/' + event.start.getFullYear();
      var end = (event.end.getMonth()+1) + '/' + event.end.getDate() + '/' + event.end.getFullYear();
      responseStr += '*' + event.summary + ':*\n';
      responseStr += '_' + start + ' - ' + end + '_\n';
      responseStr += event.description + '\n\n';
    });
    cb(responseStr);
  });
}
