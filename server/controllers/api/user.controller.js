var User = require('../../models').User;

module.exports = {
  findActiveClimbers: function(req, res) {
    var authUser = req.decoded.user;

    User.find({climb: true}, function(err, climbers) {
      if (err) console.error(err);
      var result = climbers.map(function(climber) {

        if (climber.username === authUser) return;

        return {
          id: climber.id,
          username: climber.username,
          first: climber.name.first,
          last: climber.name.last,
          pendingReq: climber.pendingReq,
          zipCode: climber.zipCode,
          gender: climber.gender,
          skillLevel: climber.skillLevel
        };
      });
      res.json(result);
    });
  }
};
