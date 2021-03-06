angular.module('nova', [
  'nova.auth',
  'nova.services',
  'ui.router',
  'nova.main',
  'nova.update',
  'nova.notifications'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
  $urlRouterProvider.otherwise("/signin");
  $stateProvider
    .state('main', {
      url: "/main",
      templateUrl: "app/main/main.html",
      controller: "MainController"
    })
    .state('signin', {
      url: "/signin",
      templateUrl: "app/auth/signin.html",
      controller: "AuthController"
    })
    .state('signup', {
      url: "/signup",
      templateUrl: "app/auth/signup.html",
      controller: "AuthController"
    })
    .state('update', {
      url: "/update",
      templateUrl: "app/update/update.html",
      controller: "UpdateController"
    })
    .state('logout', {
      url: "/logout",
      controller: function($scope, Auth, AppInfo){
        Auth.signout();
      }
    })
    .state('notifications', {
      url: "/notifications",
      templateUrl: "app/notifications/notifications.html",
      controller: "NotificationCtrl"
    });

    //attaches token on each HTTP request(POST and GET)
    $httpProvider.interceptors.push('AttachTokens');
})
.factory('AppInfo',function($window, $rootScope, $interval, Climbers){
  var info = {};
  info.user = {};

  if(info.user.id === undefined){
    var tempId = $window.localStorage.getItem('onBelay.userId');
    if(tempId !== null){
      info.user.id = tempId;
    }
  }
  //update on interval
  var doUpdate = function() {
    //update user
    if(info.user.id !== undefined){
      Climbers.getClimberById(info.user.id).then(function(userRes){
        angular.extend(info.user, userRes);
        $rootScope.username = userRes.username;
      });
    }
  };
  //run the update process on load then on an interval
  doUpdate();
  var intRef = $interval(doUpdate, 3000);

  return info;
})
.factory('AttachTokens', function($window){
  var attach = {
    request: function(object) {
      var jwt = $window.localStorage.getItem('onBelay.token');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

//below: it will run immediately when it loads the app
//below makes sures that you are authenticated before you can proceed to other pages
.run(function($rootScope, $state, Auth) {
  //event listener
  $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams){
    if (toState.name === 'signin') {
      return;
    }
    if (!Auth.isAuth() && toState.name !== 'signup'){
      evt.preventDefault();
      $state.go('signin');
    }
  });
});
