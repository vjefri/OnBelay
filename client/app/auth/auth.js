angular.module('nova.auth', [])

.controller('AuthController', function ($scope, $rootScope, $window, $state, Auth, Notify, AppInfo, Climbers) {
  $scope.user = {};
  $rootScope.unread = $rootScope.unread || 0;

  if (Auth.isAuth()) {
    $rootScope.hasAuth = true;
  }

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('com.nova', data.token);
        $rootScope.hasAuth = true;
        AppInfo.user.id = data.id;
        Climbers.getClimberById(data.id).then(function(userRes){
          angular.extend(AppInfo.user, userRes);
          $state.go('main');
          $scope.checkNotifications();
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (data) {
        console.log('SIGNUP DATA', data);
        $window.localStorage.setItem('com.nova', data.token);
        $rootScope.hasAuth = true;
        AppInfo.user.id = data.id;
        $state.go('update');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.checkNotifications = function() {
    if ($rootScope.hasAuth && $state.name !== 'notifications') {
      // Notify.checkNotifications().then(function(resp) {
        $rootScope.unread = Notify.checkNotifications()|| 0;
      // });
    }
  };

  $scope.checkNotifications();
  //update red notification circle every 1 sec
  $interval($scope.checkNotifications, 1000);
});
