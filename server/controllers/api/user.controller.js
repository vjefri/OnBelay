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
    resultArray.filter(function(climber){
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
  User.find({
    _id: id
  }, function(err, climberArray) {
    if (err) console.error(err);
    //if we don't get an array back or array items 404
    if(!Array.isArray(climberArray) || climberArray.length < 1){
      res.sendStatus(404);
      return;
    }
    //grab the first entry (there should only be one) in the climber array and send it back
    var climber = climberArray[0];
    res.json(helpers.buildUser(climber));
  });
};
