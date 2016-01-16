var User = require('../../models').User;
var url = require('url');

module.exports.findActiveClimbers = function(req, res) {
  var authUser = req.decoded.user;

  User.find({
    climb: true
  }, function(err, climbers) {
    if (err) console.error(err);
    var result = climbers.map(function(climber) {

      //this code is what is causing nulls to enter the results...
      //TODO: filter result array before sending response
      if (climber.username === authUser) return;

      return {
        id: climber.id,
        username: climber.username,
        name:climber.name,
        first: climber.name.first,
        last: climber.name.last,
        zipCode: climber.zipCode,
        gender: climber.gender,
        skillLevel: climber.skillLevel,
        notification: climber.notifications
      };
    });
    res.json(result);
  });
};

module.exports.getClimberById = function(req, res) {
  var id = url.parse(req.url, true).query.id;
  User.find({
    _id: id
  }, function(err, climber) {
    if (err) console.error(err);
    climber = climber[0];
    var result = {
      id: climber.id,
      username: climber.username,
      name:climber.name,
      first: climber.name.first,
      last: climber.name.last,
      zipCode: climber.zipCode,
      gender: climber.gender,
      skillLevel: climber.skillLevel,
      notification: climber.notifications
    };
    res.json(result);
  });
};
