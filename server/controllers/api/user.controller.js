var User = require('../../models').User;
var helpers = require('../apiHelpers.js');
var url = require('url');

module.exports.findActiveClimbers = function(req, res) {
  var authUserId = req.decoded.id;
  User.find({
    climb: true
  }, function(err, climbers) {
    if (err) console.error(err);
    //map resulting climbers to array for use in json response
    //buildUser only includes fields needed on the front end, excluding password etc
    var resultArray = climbers.map(function(climber) {
      return helpers.buildUser(climber);
    });
    //remove current user from Active Climbers
    resultArray = resultArray.filter(function(climber){
      if (climber.id === authUserId){
        return false;
      }
      return true;
    });
    res.json(resultArray);
  });
};

module.exports.getClimberById = function(req, res) {
  var id = url.parse(req.url, true).query.id;
  if(id === 'undefined'){
    res.sendStatus(404);
    return;
  }
  User.findOne({_id: id })
      //populate swaps out the notification _id with the complete notifications object
      .populate('notifications.incoming')
      .populate('notifications.outgoing')
      .exec(function(err, climber) {
        if (err) console.error(err);
        //if we don't get a user back
        if(!climber){
          res.sendStatus(404);
          return;
        }
        res.json(helpers.buildUser(climber));
      });
};
