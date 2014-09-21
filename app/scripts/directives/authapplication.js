define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.directives.Authapplication', [])
        .directive('authApplication', ['$rootScope', '$log', '$timeout', '$location', '$cookieStore', 'authResource', 'authService',
            function($rootScope, $log, $timeout, $location, $cookieStore, authResource, authService) {
            return {
                restrict: 'C',
                link: function postLink($scope, $element, $attrs) {

                    var nextRoute = null;
                    
                    // get next route
                    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
                        nextRoute = previous ? previous.$$route.originalPath : '/';
                    });
                    // authorization ping
                    $scope.$on('event:auth-ping', function() {
                        $log.debug('event:auth-ping', nextRoute);
                        authResource.authentifiedRequest('GET', '/api/ping', {}, function(){
                            authService.loginConfirmed();
                        });
                    });
                    // authorization login successfull
                    $scope.$on('event:auth-loginConfirmed', function(event, data) {
                        if( !data ) return;

                        $log.debug('event:auth-loginConfirmed', event, data);

                        // set user n token cookie
                        $rootScope.user = data;
                        $cookieStore.put('user', data);
                        
                        // redirect to previous route
                        $location.path( nextRoute );
                    });
                    // authorization login required
                    $scope.$on('event:auth-loginRequired', function(event, data) {
                        $log.debug('event:auth-loginRequired', data.data);
                        // remove token n user
                        $cookieStore.remove('user');
                        $rootScope.user = null;
                        // send message
                        $scope.$emit('event:auth-message', {
                            status: data.status + ' ' + data.statusText,
                            description: data.data.message
                        });
                        // redirect to login
                        $location.path( "/login" );
                    });
                    
                }
            };
        }]);
});
