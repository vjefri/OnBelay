
var User = require('../../models').User;

exports.updateProfile = function(req, res) {
  var authUser = req.decoded.user;
  //find User
  User.findOne({ username: authUser }, function(err, user) {
    if (err) console.error(err);

    if (!user) {
      res.json({ success: false, reason: 'User not found' });
    } else {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.zipCode = req.body.zipCode;
      user.skillLevel = req.body.skillLevel;
      user.gender = req.body.gender;

      user.save(function(err, user) {
        if (err) console.error(err);
        res.json({ success: true });
      });
    }
  });
};