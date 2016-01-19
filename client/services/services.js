angular.module('nova.services', [])

.factory('Auth', function($http, $state, $window, AppInfo){

  var signin = function(user){
    return $http({
      method: 'POST',
      url: '/api/signin',
      data: user
    })
    .then(function(resp){
      return resp.data;
    });
  };

  var signup = function(user){
    return $http({
      method: 'POST',
      url: '/api/signup',
      data: user
    })
    .then(function(resp){
      return resp.data;
    })
    .catch(function(err) {
      $state.go('signup');
    });
  };

  var signout = function(){
    AppInfo.data.hasAuth = false;
    $window.localStorage.removeItem('onBelay.token');
    $window.localStorage.removeItem('onBelay.userId');
    AppInfo.user = {};
    console.log('user has signed out!');
    $state.go('signin');
  };

  return {
    signin: signin,
    signup: signup,
    signout: signout
  };
})

.factory('Climbers', function($http){

  var getClimbers = function(){
    return $http({
      method: 'GET',
      url: "/api/auth/user/climbers"
    }).then(function(res){
      return res.data;
    });
  };

  var getClimberById = function(id){
    return $http({
      method: 'GET',
      url: "/api/auth/user/climberid?id=" + id
    }).then(function(res){
      return res.data;
    });
  };

  var getStatus = function() {
    return $http({
      method: 'GET',
      url: '/api/auth/user/flag'
    }).then(function(resp) {
      return resp.data;
    });
  };

  var updateStatus = function(climber) {
    climber = climber || false;
    return $http({
      method: 'PUT',
      url: '/api/auth/user/flag',
      data: {from: climber}
    }).then(function(resp) {
      return resp.data;
    });

  };

  return {
    getStatus: getStatus,
    updateStatus: updateStatus,
    getClimbers: getClimbers,
    getClimberById: getClimberById
  };

})

.factory('Update', function($http){
  var update = function(user){
    return $http.put('/api/auth/user/update', user)
    .then(function(response){
      return response.data;
    })
    .catch(function(err){
      console.error(err);
    });
  };

  return {
    update: update
  };

})

.factory('Notify', function($http, $interval, AppInfo) {

  var sendNotification = function(climber,message) {
    return $http({
      method: 'POST',
      url: '/api/auth/user/notifications/create',
      data: {targetUser: climber, message:message}
    }).then(function(res) {
      return res.data;
    });
  };

  var checkNotifications = function() {
    return currentNotifications.length;
  };

  var fetchAllNotifications = function() {
    return $http({
      method: 'GET',
      url: '/api/auth/user/notifications/incoming'
    }).then(function(res) {
      return res.data;
    });
  };

  var markAllNotificationsRead = function() {
    return $http({
      method: 'PUT',
      url: '/api/auth/user/notifications/read'
    }).then(function(resp) {
      //console.log(resp.data);
      //$rootScope.unread = 0;
      return resp.data;
    });
  };

  var replyToClimber = function(climber, reply) {
    return $http({
      method: 'PUT',
      url: '/api/auth/user/notifications/reply',
      data: {
        notificationId: climber.id,
        reply: reply
      }
    }).then(function(res) {
      return res.data;
    });
  };

  var currentNotifications = {};

  var updateNotfications = function(){
    return $http({
      method: 'GET',
      url: '/api/auth/user/notifications/incoming'
    }).then(function(res) {
      currentNotifications = res.data;
      console.log("Current Notifications is", currentNotifications);
    });

  };

  if(AppInfo.data.hasAuth){
    updateNotfications();
    $interval(updateNotfications, 5000);
  }

  return {
    sendNotification: sendNotification,
    checkNotifications: checkNotifications,
    fetchAllNotifications: fetchAllNotifications,
    markAllNotificationsRead: markAllNotificationsRead,
    replyToClimber: replyToClimber,
    currentNotifications: currentNotifications,
  };

});
