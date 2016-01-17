angular.module('nova.main', [])

.controller('MainController', function($scope, $interval, $window, Climbers, Notify, Auth, AppInfo) {
  $scope.activeClimbers = {};
  $scope.status = false;
  $scope.invitationMessage='';
  $scope.climbOnClicked = false;

  angular.extend($scope, AppInfo);

  if(AppInfo.user.id === undefined){
    var tempId = $window.localStorage.getItem('onBelay.userId');
    if(tempId !== null){
      AppInfo.user.id = tempId;
    }
  }

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
    console.log($scope.climbOnClicked);
    $scope.climbOnClicked=true;
  };

  $scope.sendInvitationToClimb = function(climber, message) {
    Notify.sendNotification(climber, message)
      .then(function(res) {
        $scope.climbOnClicked=false;
        $scope.invitationMessage='';
      })
      .catch(function(err) {
        console.error(err);
      });
  };

  //get the initial status of the current user
  $scope.getStatus();

  //update process for main run on interval
  var runUpdate = function() {
    //update active climbers
    $scope.getActiveClimbers();
    //update user in app info
    if(AppInfo.user.id !== undefined){
      Climbers.getClimberById(AppInfo.user.id).then(function(userRes){
        angular.extend(AppInfo.user, userRes);
      });
    }

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