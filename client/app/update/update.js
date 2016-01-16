angular.module('nova.update', [])

.controller('UpdateController', function($scope, $state, Update, AppInfo){
  $scope.user = {};

  Climbers.getClimberById(data.id).then(function(userRes){
    angular.extend(AppInfo.user, userRes);
    angular.extend($scope.user, AppInfo.user);
  });



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
