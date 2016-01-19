angular.module('nova.update', [])

.controller('UpdateController', function($scope, $state, Update, Climbers, AppInfo, $window){
  $scope.user = {};
  angular.extend($scope.user, AppInfo.user);

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
