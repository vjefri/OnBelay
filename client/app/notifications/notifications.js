angular.module('nova.notifications', [])

.controller('NotificationCtrl', function($scope, $interval, Notify, Climbers, AppInfo) {
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

  $scope.climbOn = function(climber) {
    Notify.confirmClimber(climber)
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
  
  $scope.cancel = function(climber) {
    Notify.cancelRequest(climber, true)
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
