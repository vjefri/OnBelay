angular.module('nova.notifications', ['ngDialog'])

  .controller('NotificationCtrl', function(ngDialog, $scope, $interval, Notify, Climbers, AppInfo) {
    $scope.notifications = {};

    $scope.getAllNotifications = function() {
      $scope.notifications = AppInfo.user.notifications; 
    };

    $scope.readAllNotifications = function() {
      Notify.markAllNotificationsRead()
        .then(function(res) {
          console.log(res);
        })
        .catch(function(err) {
          console.error(err);
        });
    }();

    $scope.climbOn = function(climber, reply) {
      Notify.replyToClimber(climber, reply)
        .then(function(res) {
          console.log(res);
          // Turn flags off for both users
          Climbers.updateStatus(climber)
            .then(function(res) {
              console.log(res);
            })
            .catch(function(err) {
              console.error(err);
            });
        })
        .catch(function(err) {
          console.error(err);
        });
    };

    $scope.confirmClimb = function(climber, confirm) {
      Notify.confirmClimber(climber, confirm)
        .then(function(res) {
          console.log(res);
          // Turn flags off for both users
          Climbers.updateStatus(climber)
            .then(function(res) {
              console.log(res);
            })
            .catch(function(err) {
              console.error(err);
            });
        })
        .catch(function(err) {
          console.error(err);
        });
    };
    

    //get all notifications in interval
    $interval($scope.getAllNotifications, 1000);
    
  });
