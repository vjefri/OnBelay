
//takes in user model and outputs an object
module.exports.buildUser = function(userModel){
  var userObj = {};
  userObj.id = userModel.id;
  userObj.username = userModel.username;
  userObj.name = userModel.name;
  userObj.first = userModel.name.first;
  userObj.last = userModel.name.last;
  userObj.zipCode = userModel.zipCode;
  userObj.gender = userModel.gender;
  userObj.skillLevel = userModel.skillLevel;
  userObj.climb = userModel.climb;
  userObj.notifications = userModel.notifications;
  return userObj;
};
