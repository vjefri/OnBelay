angular.module('nova.update', [])

.controller('UpdateController', function($scope, $state, Update, Climbers, AppInfo, $window){
  $scope.user = {};
  $scope.user.name = {};

  //in case user goes to update before polling completes... not very DRY unfortunately
  if(AppInfo.user.id !== undefined){
    Climbers.getClimberById(AppInfo.user.id).then(function(userRes){
      angular.extend(AppInfo.user, userRes);
      angular.extend($scope.user, AppInfo.user);
    });
  }

  $scope.update = function(){
    Update.update($scope.user)
    .then(function (res) {
        $state.go('main');
      })
      .catch(function (error) {
        console.error(error);
      });
  };
});
