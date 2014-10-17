define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.directives.Authapplication', [])
        .directive('authApplication', ['$rootScope', '$log', '$route', '$location', '$cookieStore', '$modal', 'authUser',
            function($rootScope, $log, $route, $location, $cookieStore, $modal, authUser) {
            return {
                restrict: 'C',
                link: function postLink($scope, $element, $attrs) {

                    var callback  = null;

                    // Login Dialog
                    var LoginDialog = {
                        modalInstance: null,
                        opened: false,
                        open: function() {
                            var self = this;
                            self.opened = true;
                            self.modalInstance = $modal.open({
                                backdrop    : 'static',
                                templateUrl : 'views/login.html',
                                windowClass : 'modal-window-center',
                                size        : 'sm',
                                controller: function ($scope, $modalInstance, $rootScope, $http, $log, authService, authUser) {
                                    $scope.user = {
                                        username: 'gojay',
                                        password: 'gojay86'
                                    };
                                    
                                    // get token OAuth user credentials
                                    $scope.login = function(){
                                        $log.info('[LoginDialog] user logged in...');
                                        
                                        authUser.login($scope.user).then(function(data, status){
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
                                        });
                                    };
                                    // OAuth refresh token
                                    $scope.refresh = function () {
                                        $rootScope.loading = true;
                                        $log.info('[refresh] get request refresh token..');
                                        
                                        authUser.refresh().then(function(data, status){
                                            $log.debug('authentifiedRequest:refresh_token', data, status);
                                            
                                            // close login dialog
                                            LoginDialog.close();

                                            // login confirmed
                                            // send data, then update config headers token
                                            authService.loginConfirmed(data, function(config){
                                                config.headers['Authorization'] = data['token_type'] + ' ' + data['access_token'];
                                                return config;
                                            });
                                        })
                                    };
                                    // logout
                                    $scope.logout = function () {
                                        // remove token n user
                                        $log.info('[Logout] remove user token...');
                                        $cookieStore.remove('oauth');
                                        $cookieStore.remove('user');
                                        $rootScope.user = null;
                                        $modalInstance.dismiss('cancel');
                                    };
                                    $scope.cancel = function () {
                                        $modalInstance.dismiss('cancel');
                                    };
                                }
                            });
                            self.modalInstance.result.then(function() {
                                $log.info('[LoginDialog] close');
                                self.opened = false;
                            }, function() {
                                $log.info('[LoginDialog] cancel');
                                self.opened = false;
                                $location.path('/');
                            });
                        },
                        close: function() {
                            this.modalInstance.close();
                        }
                    };

                    // authorization ping
                    $scope.$on('event:auth-ping', function(event, callback) {
                        $log.debug('event:auth-ping', $location.url());

                        $log.info('[ping] get user info..');
                        $log.debug('[ping] user', $cookieStore.get('user'));

                        // set callback
                        callback = callback;

                        authUser.ping().then(function(){
                            $log.info('[ping] User is authenticated, go to next route ' + $location.url());
                            // call calllback
                            if( callback ) callback.call(this);
                        });
                    });

                    // authorization login required
                    $scope.$on('event:auth-loginRequired', function(event, data) {
                        $log.debug('event:auth-loginRequired', data, data.headers());

                        $rootScope.loading = false;
                        // set auth error message
                        $rootScope.authError = {
                            statusCode   : data.status,
                            statusMessage: data.statusText,
                            description  : data.data['error_description']
                        };

                        // check token is expired ?
                        var regExpired = new RegExp("expired","i");
                        if( data.status == 401 && 
                            data.data.error === 'invalid_token' &&
                            regExpired.test(data.data['error_description']) ) {
                            $log.error('[loginRequired] Your token is expired...');
                            // do something when token is expired..
                            $rootScope.authError['expired'] = true;
                        }

                        $log.info('[loginConfirmed] ' + (LoginDialog.opened ? 'login dialog is opened' : 'open login dialog...'));
                        if( !LoginDialog.opened ) LoginDialog.open();
                    });

                    // authorization login successfull
                    $scope.$on('event:auth-loginConfirmed', function(event, oauth) {
                        $log.debug('event:auth-loginConfirmed', event, oauth);

                        // close login dialog
                        LoginDialog.close();

                        // put token data
                        $log.info('[loginConfirmed] put token..');
                        if(angular.isDefined($cookieStore.get('oauth'))) {
                            $log.info('[loginConfirmed] refresh token..');
                        }
                        $cookieStore.put('oauth', oauth);

                        var hasUser = $rootScope.user != null && $cookieStore.get('user') != null;
                        if( hasUser ) {
                            $log.info('[loginConfirmed] allready has user info..');
                            $log.info('[loginConfirmed] go to ' + $location.url());
                            $route.reload();
                        } else {
                            // get user info
                            $log.info('[loginConfirmed] get user info..');
                            
                            authUser.me().then(function(user){
                                // set user n token cookie
                                $log.info('[loginConfirmed] set user n token into cookie...');
                                $rootScope.user = user;
                                $cookieStore.put('user', user);
                                // redirect to next route
                                $log.info('[loginConfirmed] go to ' + $location.url());
                                $route.reload();
                            });
                        }
                    });
                    
                }
            };
        }]);
});
