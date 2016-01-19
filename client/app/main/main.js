angular.module('nova.main', ['ngDialog'])

.controller('MainController', function(ngDialog, $scope, $interval, $window, Climbers, Notify, Auth, AppInfo) {
  $scope.activeClimbers = {};
  $scope.status = false;
  $scope.invitationMessage='';
  $scope.climbOnClicked = {};
  $scope.targetClimber=null;

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
    Climbers.updateStatus().then(function(res) {
      console.log(res);
    });
  };

  $scope.climbOn = function(climber) {
    //open Dialog box -- experimental by Vincent. Pls feel free to remove. 
    $scope.targetClimber = climber; 
    // $scope.$apply();
    // console.log()
    ngDialog.open({template:'app/main/message.html', scope: $scope});
    $scope.climbOnClicked[climber.id] = true;
  };
  
  /**
   *    Opens the Dialog to send Climbers a message and request to Climb
  //  */
  // $scope.openSendDialog = function() {
  //   ngDialog.open({template:'app/main/message.html', controller:'MainController'});
  // };

  $scope.sendInvitationToClimb = function(climber, message) {
    console.log(message);
    Notify.sendNotification($scope.targetClimber.username, message)
      .then(function(res) {
        $scope.invitationMessage='';
      })
      .catch(function(err) {
        console.error(err);
      });
    ngDialog.closeAll();
  };

  //get the initial status of the current user
  $scope.getStatus();

  //update process for main run on interval
  var runUpdate = function() {
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
