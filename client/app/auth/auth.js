angular.module('nova.auth', [])

.controller('AuthController', function(ngDialog, $scope, $window, $state, Auth, Notify, AppInfo, Climbers) {
  $scope.user = {};

  $scope.signin = function() {
    Auth.signin($scope.user)
      .then(function(data) {
        $window.localStorage.setItem('onBelay.token', data.token);
        $window.localStorage.setItem('onBelay.userId', data.user.id);
        angular.extend(AppInfo.user, data.user);
        AppInfo.doUpdate();
        AppInfo.data.hasAuth = true;
        $state.go('main');
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.signup = function() {
    Auth.signup($scope.user).then(function(data) {
      if (data) {
        console.log('SIGNUP DATA', data);
        $window.localStorage.setItem('onBelay.token', data.token);
        $window.localStorage.setItem('onBelay.userId', data.user.id);
        angular.extend(AppInfo.user, data.user);
        AppInfo.doUpdate();
        AppInfo.data.hasAuth = true;
        $state.go('update');
      } else {
        $state.go('signup');
        $scope.user.password = '';
        $scope.user.username = '';
        //show dialog to user that the user is taken
        // fokr
        $scope.showDialog();
        // var usernameInput = angular.element( document.querySelector( '#username' ) );
        //        usernameInput.attr('placeholder',"Select a different username that does not already exist.");
      }
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  /**
   *    Shows the Dialog using ngDialog indicating to user that the username is taken.
   */
  $scope.showDialog = function() {
    ngDialog.open({
      template: '<p>Username is already taken! Please try again!</p>',
      plain: true
    });
  };

});
