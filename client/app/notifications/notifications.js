angular.module('nova.notifications', ['ngDialog'])

  .controller('NotificationCtrl', function(ngDialog, $scope, $interval, Notify, Climbers) {
    $scope.notifications = {};
    $scope.getAllNotifications = function() {
      Notify.fetchAllNotifications()
        .then(function(res) {
          $scope.notifications = res;
        })
        .catch(function(err) {
          console.error(err);
        });
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

    $scope.moreInformation = function(climber) {
      $scope.targetClimber = climber;
      ngDialog.open({template:'app/notifications/notifmessage.html', scope: $scope});
    };

    $scope.acceptClimb = function(climber) {
      Notify.replyToClimber(climber)
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

    $scope.denyClimb = function(climber) {
      Notify.replyToClimber(climber)
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
    
    $scope.checkNotif = function() {
      console.log("Inside of checkNotif");
      console.log("$scope.notification is ", $scope.notifications);
    };
    
    //get all notifications in interval
    $interval($scope.getAllNotifications, 1000);
    
  });
