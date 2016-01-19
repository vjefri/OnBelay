angular.module('nova', [
  'nova.auth',
  'nova.services',
  'ui.router',
  'nova.main',
  'nova.update',
  'nova.notifications'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
  $urlRouterProvider.otherwise("/main");
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
      controller: function(Auth){
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
.controller('AppController', function($scope, AppInfo){
  angular.extend($scope, AppInfo);
})
.factory('AppInfo',function($window, $interval, Climbers){
  var info = {};
  info.user = {};
  info.data = {};
  info.data.unread = 0;
  info.data.hasAuth = Boolean($window.localStorage.getItem('onBelay.token'));

  //update on interval
  info.doUpdate = function() {
    //try to get user id from local storage if it isn't defined
    if(info.user.id === undefined){
      var tempId = $window.localStorage.getItem('onBelay.userId');
      if(tempId !== null){
        info.user.id = tempId;
      }
    }
    //update user
    if(info.user.id !== undefined){
      Climbers.getClimberById(info.user.id).then(function(userRes){
        angular.extend(info.user, userRes);
        info.data.unread = info.user.notifications.incoming.length + info.user.notifications.outgoing.length;
      });
    }
  };
  //run the update process on load then on an interval
  info.doUpdate();
  var intRef = $interval(info.doUpdate, 3000);

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
.run(function($rootScope, $state, AppInfo) {
  //event listener
  $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams){
    if (toState.name === 'signin' || toState.name === 'signup') {
      return;
    }
    if (!AppInfo.data.hasAuth){
      evt.preventDefault();
      $state.go('signin');
    }
  });
});
