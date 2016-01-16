angular.module('nova.update', [])

.controller('UpdateController', function($scope, $state, Update, Climbers, AppInfo){
  $scope.user = {};

  if(AppInfo.user.id !== undefined){
    Climbers.getClimberById(AppInfo.user.id).then(function(userRes){
      angular.extend(AppInfo.user, userRes);
      angular.extend($scope.user, AppInfo.user);
    });
  } else {
    $scope.user.name = {};
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
