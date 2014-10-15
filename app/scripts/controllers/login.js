define(['angular'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.controllers.LoginCtrl', [])
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$log', 'authService', 'APP', 'APIURL',
        function ($scope, $rootScope, $http, $log, authService, APP, APIURL) {
        
      	$scope.$on('event:auth-error', function(event, message){
            console.log('event:auth-error', message);
      		$scope.alert = message;
      	});

        // $scope.loading = $rootScope.isLoading = false;
        $scope.user = {
            "username"  : 'gojay',
            "password"  : 'gojay86',
            "grant_type": 'password'
        };

        // login OAuth grant type user credentials
        $scope.user.login = function(){
            $log.info('user logged in...');

            $http({
                method : 'POST',
                url    : APIURL + '/auth/login',
                data   : $scope.user,
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic ' + btoa(APP.ID+':'+APP.SECRET)
                },
                // withCredentials: true
            })
            .success(function(data, status){
                $log.debug('auth:login:success', data, status);

                if (status < 200 || status >= 300) return;

                // clear login user
                $scope.user.username = null;
                $scope.user.password = null;
                
                // login confirmed
                // send data, then update config headers token
                authService.loginConfirmed(data, function(config){
                    config.headers['Authorization'] = data['token_type'] + ' ' + data['access_token'];
                    return config;
                });
            })
            .error(function(data, status){
                $log.error('auth:login:error');
                $log.debug('error:', data, status);
            });
        };
    }]);
});
