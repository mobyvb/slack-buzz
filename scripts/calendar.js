var ical = require('ical');
var url = 'https://www.google.com/calendar/ical/p1cujmvr6fqk5pfcgkiihpaldo%40group.calendar.google.com/public/basic.ics';

module.exports = function(robot) {
  robot.respond(/(upcoming events)/i, function(msg) {
    getEventsNear(new Date(), function(response) {
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
    var counting = false;
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
