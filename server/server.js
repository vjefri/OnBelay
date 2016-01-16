var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    controllers = require('./controllers'),
    User = require('./models').User;

var app = express();

app.set('port', process.env.PORT || 3000);

//middleware is a 

//converts to JSON for easy access on response
app.use(bodyParser.json());

//send back client folder wholesale as static route
app.use(express.static(__dirname + '/../client'));

//if it's not production
if (process.env.NODE_ENV !== 'production') {
  //app.use(require('morgan')('dev'));
}

/* seeds the db with fake users for development */
if (process.env.NODE_ENV !== 'production') {
  //connect to mongo database
  mongoose.connect('mongodb://localhost/onbelay');
  //initialize demo users
  require('../fakeUsers')();
} else {
  //for heroku, connecting to the mongo that heroku that provides you
  mongoose.connect(process.env.MONGOLAB_URI);
}

//pass in 
controllers.climbOn(app);

app.listen(app.get('port'), function() {
  console.log('climb on', app.get('port'));
});
