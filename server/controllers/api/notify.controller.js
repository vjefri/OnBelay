var User = require('../../models').User,
    Notification = require('../../models').Notification;

function sendNotification (req, res) {
  var authUser = req.decoded.user;
  var targetUser = req.body.targetUser;
  var newNotification;
  //find the username
  User.findOne({ username: authUser }, function(err, sender) {
    if (err) console.error(err);

    if (!sender) {
      res.json({ success: false, reason: 'User not found' });
    } else {
      User.findOne({ username: targetUser }, function(err, target) {

        newNotification = new Notification({
          sender: {
            id: sender.id._id,
            username: sender.username
          },
          recipient: target._id
        });

        newNotification.save(function(err, notification) {
          if (err) console.error(err);
          
          //push in id of the notification model into each users associated with the transaction
          sender.notifications.outgoing.push(notification._id);
          target.notifications.incoming.push(notification._id);

          sender.save(function(err) {
            if (err) console.error(err);
          });
          target.save(function(err) {
            if (err) console.error(err);
          });
          res.json({ success: true });
        });
      });
    }
  });
}

function getNotifications(req, res) {
  //get username
  var authUser = req.decoded.user;
  
  console.log("authUser is ", authUser);
  
  //find that username in the database
  User.findOne({ username: authUser }, function(err, user) {

    if (err) console.error(err);
    
    //if the user isn't found, send back a JSON containing falsey info
    if (!user) {
      res.json({ success: false, reason: 'User does not exist' });
    //if the user is found
    } else {
      var copyIncoming = user.notifications.incoming.slice();
      var copyOutgoing = user.notifications.outgoing.slice();
      
      console.log("incoming in notify.controller is :", user.notifications.incoming);
      console.log("outgoing in notify.controller is :", user.notifications.outgoing);
      
      //combine both notification arrays that contains IDs together
      var both = copyIncoming.concat(copyOutgoing);
      
      //get all the notifications of that user from Notification Mongo model
      Notification.find({ _id: { $in: both }}, function(err, notifications) {

        if (err) console.error(err);
        
        console.log("notification is ",notifications);
        
        //get all the incoming notifications and filter all the incoming messages
        var incomingNotif = notifications.map(function(notification) {
          if ( notification.sender.username !== authUser  && !notification.isResolved) {
            return {
              id: notification._id,
              sender: {
                username: notification.sender.username
              },
              isRead: notification.isRead,
              isAccepted: notification.isAccepted,
              createdAt: notification.createdAt
            };
          }
        }).filter(function(item) {
          return !!item;
        });
        
        var outgoingNotif = notifications.map(function(notification) {
          if (notification.sender.username === authUser && !notification.isResolved) {
            return {
              id: notification._id,
              sender: {
                username: notification.sender.username
              },
              recipient : notification.recipient,
              isRead: notification.isRead,
              isAccepted: notification.isAccepted,
              createdAt: notification.createdAt
            };
          }
        }).filter(function(item) {
          return !!item;
        });
        

        
        //save incoming notifications in a filtered array
        // var respNotifications = notifications.map(function(notification) {
          
        //   //checks to see if the notification is resolved
        //   if (!notification.isResolved) {
        //     return {
        //       id: notification._id,
        //       sender: {
        //         username: notification.sender.username
        //       },
        //       isRead: notification.isRead,
        //       createdAt: notification.createdAt
        //     };
        //   }
        //   //filter all the items that are empty
        // }).filter(function(item) {
        //   return !!item;
        // });
        
        console.log("JSON sent is ", {incoming : incomingNotif, outgoing : outgoingNotif});
        
        //send back the array in a JSON
        res.json({incoming : incomingNotif, outgoing : outgoingNotif});
      });
    }
  });
}

function readNotifications(req, res) {
  var authUser = req.decoded.user;

  User.findOne({ username: authUser }, function(err, user) {
    if (err) console.error(err);

    if (!user) {
      res.json({ success: false, reason: 'User does not exist' });
    } else {

      Notification.find({ _id: { $in: user.notifications.incoming }}, function(err, notifications) {

        notifications.forEach(function(notification) {
          notification.markRead();
          notification.save();
        });

        res.json({ success: true });
      });
    }
  });
}

function replyNotification(req, res) {
  var notificationId = req.body.notificationId;
  var reply = req.body.reply;

  Notification.findById(notificationId, function(err, notification) {
    if (err) console.error(err);

    notification.markAccepted(reply);
    notification.markResolved();
    notification.save(function(err, notification) {
      res.json({ success: true });
    });
  });
}

/**
 *    
 *    Checks if the user has any unread notifications
 *    
 */
function checkUnread(req, res) {
  //what is this decoded? It is an object with User data
  var authUser = req.decoded.user;
  console.log('Req.Decoded.User is ', authUser);

  //find the User in the Mongo Database
  User.findOne({ username: authUser }, function(err, user) {
    //if not found in database
    if (err) console.error(err);
    
    //send 401 if user not found
    if (!user) {
      res.sendStatus(401);
    //if user is found
    } else {
      //find any notifications that are incoming
      Notification.find({ _id: { $in: user.notifications.incoming }}, function(err, notifications) {
        if (err) console.error(err);
        
        //creates a unread notification array
        var unread = notifications.filter(function(notification) {
          return notification.isRead === false;
        }).length;

        res.json(unread);
      });
    }
  });
}

module.exports = {
  sendNotification: sendNotification,
  getNotifications: getNotifications,
  readNotifications: readNotifications,
  replyNotification: replyNotification,
  checkUnread: checkUnread
};
