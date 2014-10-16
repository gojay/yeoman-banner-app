define(['angular'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.controllers.LoginCtrl', [])
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$log', '$timeout', 'authService', 'APP', 'APIURL',
        function ($scope, $rootScope, $http, $log, $timeout, authService, APP, APIURL) {
        
        $rootScope.loading = false;
        $scope.user = {
            "username"  : 'gojay',
            "password"  : 'gojay86',
            "grant_type": 'password'
        };

        // login OAuth grant type user credentials
        $scope.login = function(){
            $log.info('user logged in...');

            $rootScope.loading = true;
            $http({
                method : 'POST',
                url    : APIURL + '/auth/login',
                data   : $scope.user,
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Basic ' + btoa(APP.ID+':'+APP.SECRET)
                }
            })
            .success(function(data, status){
                $log.debug('auth:login:success', data, status);

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

                $rootScope.loading = false;
                
                $rootScope.authError = {
                    status     : status + ' Unauthorized',
                    description: data['error_description']
                };
            });
        };
    }]);
});
