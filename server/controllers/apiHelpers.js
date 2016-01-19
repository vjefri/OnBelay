
//takes in user model and outputs an object
module.exports.buildUser = function(userModel){
  var userObj = {};
  userObj.id = userModel.id;
  userObj.username = userModel.username;
  userObj.first = userModel.firstName;
  userObj.last = userModel.lastName;
  userObj.zipCode = userModel.zipCode;
  userObj.gender = userModel.gender;
  userObj.skillLevel = userModel.skillLevel;
  userObj.climb = userModel.climb;
  userObj.notifications = userModel.notifications;
  return userObj;
};
