define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.directives.Authapplication', [])
        .directive('authApplication', ['$rootScope', '$log', '$timeout', '$location', '$cookieStore', 'authResource', 'authService',
            function($rootScope, $log, $timeout, $location, $cookieStore, authResource, authService) {
            return {
                restrict: 'C',
                link: function postLink($scope, $element, $attrs) {

                    $scope.nextRoute = '/';
                    $scope.callback = null;

                    $rootScope.$on('cfpLoadingBar:progress', function(data, percent){
                        angular.element('#view.container').css('opacity', Math.round(percent) / 100);
                    });

                    // get next route
                    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
                        $scope.nextRoute = previous ? previous.$$route.originalPath : '/';
                    });

                    // authorization ping
                    $scope.$on('event:auth-ping', function(event, callback) {
                        $log.debug('event:auth-ping', $scope.nextRoute);
                        // var user = $cookieStore.get('user');
                        // $log.debug('user', user);

                        // set callback
                        $scope.callback = callback;

                        authResource.authentifiedRequest('GET', '/auth/ping', {}, function(){
                            $log.info('User authenticaed go to next route ' + $scope.nextRoute);
                            // call calllback
                            $scope.callback.call(this);
                        });
                    });

                    // authorization login successfull
                    $scope.$on('event:auth-loginConfirmed', function(event, oauth) {
                        $log.debug('event:auth-loginConfirmed', event, oauth);

                        $cookieStore.put('oauth', data);

                        // get user info
                        $log.info('get user info..');
                        authResource.authentifiedRequest('GET', '/auth/me', {}, function(user){
                            // set user n token cookie
                            $rootScope.user = user;
                            $cookieStore.put('user', user);
                            // redirect to previous route
                            $location.path( $scope.nextRoute );
                        });
                    });

                    // authorization login required
                    $scope.$on('event:auth-loginRequired', function(event, data) {
                        $log.debug('event:auth-loginRequired', data);
                        // remove token n user
                        $cookieStore.remove('user');
                        $cookieStore.remove('oauth');
                        $rootScope.user = null;
                        // send message
                        $rootScope.$broadcast('event:auth-error', {
                            status     : data.status + ' ' + data.statusText,
                            description: data.data['error_description']
                        });
                        // redirect to login
                        $location.path( "/login" );
                    });
                    
                }
            };
        }]);
});
