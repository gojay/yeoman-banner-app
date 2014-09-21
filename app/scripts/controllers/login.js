define(['angular'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.controllers.LoginCtrl', [])
    .controller('LoginCtrl', ['$scope', '$rootScope', 'authResource', 'authService', function ($scope, $rootScope, authResource, authService) {

      	$rootScope.$on('event:auth-message', function(event, message){
      		  $scope.alert = message;
      	});

        $scope.user = {
            email : 'dani.gojay@gmail.com',
            password : 'admin'
        };
        $scope.user.login = function(){
            authResource.authentifiedRequest('POST', '/api/login', $scope.user, function(data, status){
                console.log('auth:login', data, status);

                if (status < 200 || status >= 300) return;

                $scope.user.email = null;
                $scope.user.password = null;
                
                // login confirmed
                // send data, then update config headers token
                authService.loginConfirmed(data, function(config){
                    config.headers["X-Auth-Token"] = data.token;
                    return config;
                });
            })
        };
    }]);
});
