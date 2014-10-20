define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.directives.Authapplication', [])
        .directive('authApplication', ['$rootScope', '$log', '$route', '$location', '$cookieStore', '$modal', 'authService', 'authUser',
            function($rootScope, $log, $route, $location, $cookieStore, $modal, authService, authUser) {
            return {
                restrict: 'E',
                template: '<div id="view" class="container" ng-class="{\'at-view-slide-in-right at-view-slide-out-right\': !$root.isLogin && !$root.isDownwards, \'at-view-slide-in-left at-view-slide-out-left\'  : !$root.isLogin && $root.isDownwards}" ng-view></div>',
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
                                        $rootScope.loading = true;
                                        $log.info('[LoginDialog] user logged in...');
                                        
                                        authUser.oauthUser($scope.user).then(function(data){
                                            $log.debug('auth:login:success', data);

                                            // clear login user
                                            $scope.user.username = null;
                                            $scope.user.password = null;
                                            
                                            // login confirmed
                                            // if(!authUser.isJwt()) {
                                            //     data['expires'] = Date.now() + (data['expires_in'] * 1000);
                                            // }
                                            authService.loginConfirmed(data);
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
                                            authService.loginConfirmed(data);
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

                        // set callback
                        callback = callback;

                        authUser.ping().then(function(){
                            $log.info('[ping] User is authenticated, go to next route ' + $location.url());
                            // call calllback
                            if( callback ) callback.call(this);
                        });
                    });

                    // authorization login required
                    $scope.$on('event:auth-loginRequired', function(event, rejection) {
                        $log.debug('event:auth-loginRequired', rejection, rejection.headers());

                        $rootScope.isLogin = true;
                        $rootScope.loading = false;

                        // check token is expired ?
                        var regExpired = new RegExp("expired","i");
                        if( (angular.isDefined(rejection.data.error) && rejection.data.error === 'invalid_token') &&
                            (angular.isDefined(rejection.data['error_description']) && regExpired.test(rejection.data['error_description'])) ) {
                            $log.error('[loginRequired] Your token is expired...');
                            // do something when token is expired..
                            $rootScope.authError['expired'] = true;
                        }

                        $log.info('[loginRequired] ' + (LoginDialog.opened ? 'login dialog is opened' : 'open login dialog...'));
                        if( !LoginDialog.opened ) LoginDialog.open();
                    });

                    // authorization login successfull
                    $scope.$on('event:auth-loginConfirmed', function(event, oauth) {
                        $log.debug('event:auth-loginConfirmed', event, oauth);

                        $rootScope.isLogin = false;

                        // close login dialog
                        if( LoginDialog.opened ) LoginDialog.close();

                        // put token data
                        $log.info('[loginConfirmed] put token..');
                        if(localStorage.getItem('token')) {
                            $log.info('[loginConfirmed] is refresh token..');
                        }
                        var token = angular.toJson(oauth);
                        localStorage.setItem('token', token);

                        if( authUser.hasUser() ) {
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
                                // serialize obj json
                                localStorage.setItem('user', angular.toJson(user));
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
