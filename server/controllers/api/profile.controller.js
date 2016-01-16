var User = require('../../models').User;

function updateProfile (req, res) {
  var authUser = req.decoded.user;
  //find User
  User.findOne({ username: authUser }, function(err, user) {
    if (err) console.error(err);

    if (!user) {
      res.json({ success: false, reason: 'User not found' });
    } else {
      user.name.first = req.body.name.first;
      user.name.last = req.body.name.last;
      user.zipCode = req.body.zipCode;
      user.skillLevel = req.body.skillLevel;
      user.gender = req.body.gender;

      user.save(function(err, user) {
        if (err) console.error(err);
        res.json({ success: true });
      });
    }
  });
}

// save the pending climber to the pendingReq object in user's model
function updatePendingClimbers (req, res) {

}

module.exports = {
  updateProfile: updateProfile,
  updatePendingClimbers: updatePendingClimbers
};