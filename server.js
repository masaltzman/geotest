const express = require('express');
const app = express();
var session = require('express-session')

// Use the session middleware
app.use(session({
  secret: 'keyboard cat',
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true
}))
app.set('view engine', 'ejs');

console.log("about to listen on " + (process.env.PORT || 8080));
var listener = app.listen(process.env.PORT || 8080, function() {
  var port = listener.address().port;
  console.log('listening on ' + port)
});

app.get('/', function(req, res, next) {
  console.log("getting /");
  // check to see if this route was called with a query string with lat and lon
  if (req.query.nolocation) {
    req.session.location = {lat: 'n/a', lon: 'n/a'};
  }
  if (req.query.lat && req.query.lon) {
    console.log("query string: ", req.query);
    // Access the session as req.session
    // put the lat and lon from the query string into the session
    req.session.location = {lat: req.query.lat, lon: req.query.lon};
  }
  // if we have location in the session, render the showlocation.ejs page to sho
  // the location in the browser
  if (req.session.location) {
    console.log("show location: ", req.session.location);
    res.render('showlocation.ejs', {location: req.session.location});
  } else {
    console.log("getlocation.html");
    // otherwise, if we don't have the location in the session, send a special
    // html file which does this:
    // 1. get the location using the browser's navigator.geolocation.getCurrentPosition
    // 2. redirect the browser back to / but with the query string ?lat=XX&lon=XX
    res.sendFile(__dirname + '/public/getlocation.html');
  }
});

// test to make sure we can get the lat and lon from the session and display it
// to the browser
app.get('/st', function(req, res, next) {
  res.setHeader('Content-Type', 'text/html')
  res.write('<p>location: ' + req.session.location.lat + ',' + req.session.location.lon + '</p>');
  res.end()
});
