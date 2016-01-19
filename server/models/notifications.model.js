var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var notificationSchema = mongoose.Schema({
  sender: {
    id: { type: ObjectId, ref: 'User' },
    username: String,
    zipCode: Number,
    skillLevel: String,
    gender: String
  },
  recipient: { 
    id: { type: ObjectId, ref: 'User' },
    username: String,
    zipCode: Number,
    skillLevel: String,
    gender: String,
  },
  message: String,
  isRead: { type: Boolean, default: false },
  isAccepted: { type: Boolean, default: false },
  isResolved: { type: Boolean, default: false },
  isConfirmed: {type: Boolean, default: false},
  createdAt: Date,
  updatedAt: Date
});

notificationSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

notificationSchema.methods.markResolved = function() {
  this.isResolved = true;
};

notificationSchema.methods.markAccepted = function(reply) {
  this.isAccepted = reply;
};

notificationSchema.methods.markConfirmed = function(confirm) {
  this.isConfirmed = confirm;
};

notificationSchema.methods.markRead = function() {
  this.isRead = true;
};

var Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
