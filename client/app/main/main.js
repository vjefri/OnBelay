angular.module('nova.main', [])

.controller('MainController', function($scope, $interval, Climbers, Notify, Auth, AppInfo) {
  $scope.activeClimbers = {};
  $scope.status = false;
  $scope.invitationMessage='';
  $scope.climbOnClicked=false

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
    console.log($scope.climbOnClicked);
    $scope.climbOnClicked=true;
  };

  $scope.sendInvitationToClimb = function(climber, message) {
    console.log('SENT INVITATION', message);
    Notify.sendNotification(climber, message)
      .then(function(res) {
        $scope.climbOnClicked=false;
        $scope.invitationMessage='';
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  var runUpdate = function() {
    $scope.getActiveClimbers();
    $scope.getStatus();
  };

  runUpdate();
  var intRef = $interval(runUpdate, 1000);

  $scope.$on('$destroy', function() {
    $interval.cancel(intRef);
  });
});
