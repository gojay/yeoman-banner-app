define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.directives.Authapplication', [])
        .directive('authApplication', ['$rootScope', '$location', '$cookieStore', 'authResource', 'authService',
            function($rootScope,  $location, $cookieStore, authResource, authService) {
            return {
                restrict: 'C',
                link: function postLink($scope, $element, $attrs) {

                    var nextRoute = null;
                    
                    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
                        // console.log('routeChangeSuccess:event', event)
                        console.log('routeChangeSuccess:current', current);
                        console.log('routeChangeSuccess:previous', previous);
                        nextRoute = previous ? previous.$$route.originalPath : '/';
                    });
                    $scope.$on('event:auth-ping', function() {
                        console.log('event:auth-ping');
                        authResource.authentifiedRequest('GET', window.apiURL + '/api/ping', {}, function(){
                            authService.loginConfirmed();
                        });
                    });
                    $scope.$on('event:auth-loginConfirmed', function(event, data) {
                        console.log('event:auth-loginConfirmed', event, data);
                        // set user n token cookie
                        $rootScope.user = data.user;
                        $cookieStore.put('token', data.token);
                        // redirect to previous route
                        $location.path( nextRoute );
                    });
                    $scope.$on('event:auth-loginRequired', function(event, data) {
                        console.log('event:auth-loginRequired', event, data);
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
