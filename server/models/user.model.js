var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
//makes it so we can populate the item later
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  zipCode: Number,
  skillLevel: String,
  gender: String,
  climb: { type: Boolean, default: false },
  climbingWith: Object,
  notifications: {
    incoming: [{ type: ObjectId, ref: 'Notification' }],
    outgoing: [{ type: ObjectId, ref: 'Notification' }]
  },
  createdAt: Date,
  updatedAt: Date
});

userSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

userSchema.methods.hashPassword = function(password, callback) {
  var hash = bcrypt.hash(password, null, null, function(err, hash) {
    callback(hash);
  });
};

userSchema.methods.comparePassword = function(attempt, hash, callback) {
  bcrypt.compare(attempt, hash, function(err, res) {
    //res is a boolean
    callback(res);
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
