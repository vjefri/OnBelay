angular.module('nova.auth', [])

.controller('AuthController', function ($scope, $rootScope, $window, $state, Auth, Notify, $interval) {

  $scope.user = {};
  $rootScope.unread = $rootScope.unread || 0;

  if (Auth.isAuth()) {
    $rootScope.hasAuth = true;
  }

  $scope.signin = function() {
    Auth.signin($scope.user)
      .then(function(token) {
        $window.localStorage.setItem('com.nova', token);
        $window.localStorage.setItem('username', $scope.user.username);
        $rootScope.hasAuth = true;
        $state.go('main');
        //get notifications that are unread
        $scope.checkNotifications();
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.signup = function() {
    Auth.signup($scope.user)
      .then(function(token) {
        $window.localStorage.setItem('com.nova', token);
        $window.localStorage.setItem('username', $scope.user.username);
        $rootScope.hasAuth = true;
        $state.go('update');
      })
      .catch(function(error) {
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
