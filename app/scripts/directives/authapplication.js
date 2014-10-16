define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.directives.Authapplication', [])
        .directive('authApplication', ['$rootScope', '$log', '$timeout', '$location', '$cookieStore', '$modal', 'authResource',
            function($rootScope, $log, $timeout, $location, $cookieStore, $modal, authResource) {
            return {
                restrict: 'C',
                link: function postLink($scope, $element, $attrs) {

                    var callback  = null;

                    var LoginDialog = function() {
                        var modalInstance = $modal.open({
                            backdrop   : 'static',
                            templateUrl: 'views/login.html',
                            windowClass: 'modal-window-center',
                            size:'sm',
                            controller: function ($scope, $modalInstance, $rootScope, $http, $log, authService, APP, APIURL) {
                                $scope.user = {
                                    "username"  : 'gojay',
                                    "password"  : 'gojay86',
                                    "grant_type": 'password'
                                };
                                // login OAuth grant type user credentials
                                $scope.login = function(){
                                    $log.info('user logged in...');
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

                                        $rootScope.authError = {
                                            status     : status + ' Unauthorized',
                                            description: data['error_description']
                                        };
                                    });
                                };

                                $scope.refresh = function () {
                                    $modalInstance.close();
                                };
                                $scope.logout = function () {
                                    $modalInstance.dismiss('cancel');
                                };
                            }
                        });
                        $rootScope.openLoginDialog = true;
                        modalInstance.result.then(function() {
                            $log.info('close');
                            $rootScope.openLoginDialog = false;
                        }, function() {
                            $log.info('cancel');
                            $rootScope.openLoginDialog = false;
                            $location.path('/');
                        });
                    };

                    // authorization ping
                    $scope.$on('event:auth-ping', function(event, resource, callback) {
                        $log.debug('event:auth-ping', $scope.$root.nextRoute);

                        var user = $cookieStore.get('user');
                        $log.debug('user', user);

                        // set callback
                        callback = callback;

                        authResource.authentifiedRequest('POST', '/auth/ping', {resource:resource}, function(){
                            $log.info('User authenticaed go to next route ' + $scope.$root.nextRoute);
                            // call calllback
                            callback.call(this);
                        });
                    });

                    // authorization login successfull
                    $scope.$on('event:auth-loginConfirmed', function(event, oauth) {
                        $log.debug('event:auth-loginConfirmed', event, oauth);

                        // put token data
                        $log.info('put token..');
                        $cookieStore.put('oauth', oauth);

                        // get user info
                        $log.info('get user info..');
                        authResource.authentifiedRequest('GET', '/auth/me', {}, function(user){
                            // set user n token cookie
                            $rootScope.user = user;
                            $cookieStore.put('user', user);
                            // redirect to previous route
                            $location.path( $scope.$root.nextRoute );
                        });
                    });

                    // authorization login required
                    $scope.$on('event:auth-loginRequired', function(event, data) {
                        $log.debug('event:auth-loginRequired', data, $scope.$root);

                        // set auth error message
                        $rootScope.authError = {
                            status     : data.status + ' ' + data.statusText,
                            description: data.data['error_description']
                        };
                        // remove token n user
                        $log.info('remove user token...');
                        $cookieStore.remove('user');
                        $cookieStore.remove('oauth');
                        $rootScope.user = null;

                        $log.info('open login dialog...' + $rootScope.openLoginDialog);
                        if( !$rootScope.openLoginDialog ) LoginDialog();

                        // redirect to login
                        // $location.path( "/login" );
                    });
                    
                }
            };
        }]);
});
