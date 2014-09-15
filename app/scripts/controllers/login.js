define(['angular'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.controllers.LoginCtrl', [])
    .controller('LoginCtrl', ['$scope', '$rootScope', 'authResource', 'authService', function ($scope, $rootScope, authResource, authService) {

      	$rootScope.$on('event:auth-message', function(event, message){
      		$scope.alert = message;
      	});

        $scope.auth = {
            credentials: {
                username : null,
                password : null
            }
        };
        $scope.auth.login = function(){
            authResource.authentifiedRequest('POST', '/api/login', $scope.auth.credentials, function(data, status){
                console.log('auth:login', data, status);

                if (status < 200 || status >= 300) return;

                $scope.auth.credentials.username = null;
                $scope.auth.credentials.password = null;
                
                // login confirmed
                authService.loginConfirmed(data);
            })
        };
    }]);
});
