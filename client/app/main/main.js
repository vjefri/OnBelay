angular.module('nova.main', [])

.controller('MainController', function($scope, $interval, Climbers, Notify, Auth, Update) {
  $scope.activeClimbers = {};
  $scope.pendingReq = {};
  $scope.status = false;

  $scope.getActiveClimbers = function() {
    Climbers.getClimbers()
      .then(function(climbersReqArr) {
        var key;
        var climbersReqObj = {};

        //map fresh active climbers to a new object for easy comparison
        climbersReqArr.forEach(function(climber) {
          if (climber !== null) {
            climbersReqObj[climber.id] = climber;
          }
        });

        //remove climbers from activeClimbers that are NOT in climbersReqObj
        for (key in $scope.activeClimbers) {
          if (climbersReqObj[key] === undefined) {
            delete $scope.activeClimbers[key];
          }
        }

        //add climbers from the request object that are not currently in activeClimbers
        for (key in climbersReqObj) {
          if ($scope.activeClimbers[key] === undefined) {
            $scope.activeClimbers[key] = climbersReqObj[key];
          }
        }
      });
  };

  $scope.getStatus = function() {
    Climbers.getStatus().then(function(res) {
      $scope.status = res.status;
    });
  };

  $scope.updateStatus = function() {
    Climbers.updateStatus().then(function(res) {
      console.log(res);
    });
  };

  $scope.climbOn = function(climber) {
    $scope.pendingReq[climber.username] = true;
    var authUsername = Auth.authUsername;
    // add climber to auth user's pendingReq object
    Update.updatePendingClimbers(authUsername);
    Notify.sendNotification(climber.username)
      .then(function(res) {
        console.log(res);
      })
      .catch(function(err) {
        console.error(err);
      });
  };

  var runUpdate = function() {
    $scope.getActiveClimbers();
    $scope.getStatus();
  };

  runUpdate();
  $interval(runUpdate, 1000);

});
