angular.module('nova.auth', [])

.controller('AuthController', function (ngDialog, $scope, $rootScope, $window, $state, $interval, Auth, Notify, AppInfo, Climbers) {
  $scope.user = {};
  $rootScope.unread = $rootScope.unread || 0;

  if (Auth.isAuth()) {
    $rootScope.hasAuth = true;
  }

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('onBelay.token', data.token);
        $window.localStorage.setItem('onBelay.userId', data.id);
        AppInfo.user.id = data.id;
        $rootScope.hasAuth = true;
        $state.go('main');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (data) {
        if (data) {
          console.log('SIGNUP DATA', data);
          $window.localStorage.setItem('onBelay.token', data.token);
          $window.localStorage.setItem('onBelay.userId', data.id);
          AppInfo.user.id = data.id;
          $rootScope.hasAuth = true;
          $state.go('update');
	} else {
	  $state.go('signup');
	  $scope.user.password = '';
	  $scope.user.username = '';
    //show dialog to user that the user is taken
    $scope.showDialog();
	  // var usernameInput = angular.element( document.querySelector( '#username' ) );
   //        usernameInput.attr('placeholder',"Select a different username that does not already exist.");
	}
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  /**
   *    Shows the Dialog using ngDialog indicating to user that the username is taken.
   */
  $scope.showDialog = function() {
    ngDialog.open({template: '<p>Username is already taken! Please try again!</p>', plain: true });
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
