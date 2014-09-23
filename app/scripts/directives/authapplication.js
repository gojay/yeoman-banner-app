define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.directives.Authapplication', [])
        .directive('authApplication', ['$rootScope', '$log', '$timeout', '$location', '$cookieStore', 'authResource', 'authService',
            function($rootScope, $log, $timeout, $location, $cookieStore, authResource, authService) {
            return {
                restrict: 'C',
                link: function postLink($scope, $element, $attrs) {

                    $scope.nextRoute = '/';
                    $scope.deferred = null;

                    // get next route
                    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
                        $scope.nextRoute = previous ? previous.$$route.originalPath : '/';
                    });
                    // authorization ping
                    $scope.$on('event:auth-ping', function(event, deferred) {
                        $log.debug('event:auth-ping', deferred, $scope.nextRoute);

                        $scope.deferred = deferred;

                        authResource.authentifiedRequest('GET', '/api/ping', {}, function(){
                            // authService.loginConfirmed();
                            $log.info('User Authenticaed go to next route ' + $scope.nextRoute);
                            $scope.deferred.resolve();
                        });
                    });
                    // authorization login successfull
                    $scope.$on('event:auth-loginConfirmed', function(event, data) {
                        $log.debug('event:auth-loginConfirmed', event, data);

                        // set user n token cookie
                        $rootScope.user = data;
                        $cookieStore.put('user', data);
                        
                        // redirect to previous route
                        $location.path( $scope.nextRoute );
                    });
                    // authorization login required
                    $scope.$on('event:auth-loginRequired', function(event, data) {
                        $log.debug('event:auth-loginRequired', data, $scope.deferred);
                        // remove token n user
                        $cookieStore.remove('user');
                        $rootScope.user = null;
                        // send message
                        $rootScope.$broadcast('event:auth-error', {
                            status     : data.status + ' ' + data.statusText,
                            description: data.data.message
                        });
                        // redirect to login
                        $location.path( "/login" );
                    });
                    
                }
            };
        }]);
});
