angular.module('nova.main', ['ngDialog'])

.controller('MainController', function(ngDialog, $scope, $interval, $window, Climbers, Notify, Auth, AppInfo) {
  $scope.activeClimbers = {};
  $scope.status = false;
  $scope.climbOnClicked = {};
  $scope.readStatus = {};

  console.log("user", AppInfo.user);
  angular.extend($scope, AppInfo);
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
        //remove climbers from activeClimbers that are not in our request object
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
    Climbers.updateStatus()
      .then(function(res) {
        console.log(res);
      });
  };

  $scope.climbOn = function(climber) {
    $scope.climbOnClicked[climber.id] = true;
    console.log('climbOnClicked', $scope.climbOnClicked);
    // write to database currently clicked values
    Notify.sendNotification(climber)
      .then(function(res) {
        console.log(res);
      }).catch(function(err) {
        console.error(err);
      });
  };

  //get the initial status of the current user
  $scope.getStatus();

  //update process for main run on interval
  var runUpdate = function() {
    // filter climbers 
    // var confirmed = _.filter(AppInfo.user.notifications.incoming, {
    //   'isConfirmed': true
    // });
    var read = _.filter(AppInfo.user.notifications.outgoing, {
      'read': true
    });

    var resolved = _.reject(AppInfo.user.notifications.outgoing, {
      'isResolved': true
    });

    $scope.readStatus = resolved;

    //update active climbers
    $scope.getActiveClimbers();
  };
  //run the update process on load then on an interval
  runUpdate();
  var intRef = $interval(runUpdate, 3000);

  //destroy the update process running on interval, otherwise $interval
  //will persist after the controller is destroyed!
  $scope.$on('$destroy', function() {
    $interval.cancel(intRef);
  });

});
