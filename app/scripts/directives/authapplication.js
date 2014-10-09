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

                    // $rootScope.$on('cfpLoadingBar:started', function(data, a){
                    //     $log.info('cfpLoadingBar:started',data, a);
                    // });
                    // $rootScope.$on('cfpLoadingBar:completed', function(data, a){
                    //     $log.info('cfpLoadingBar:completed',data, a);
                    // });
                    // $rootScope.$on('cfpLoadingBar:loading', function(data, a){
                    //     $log.info('cfpLoadingBar:loading',data, a);
                    // });
                    // $rootScope.$on('cfpLoadingBar:loaded', function(data, a){
                    //     $log.info('cfpLoadingBar:loaded',data, a);
                    // });

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

                        // set callback
                        $scope.callback = callback;

                        authResource.authentifiedRequest('GET', '/api/ping', {}, function(){
                            // authService.loginConfirmed();
                            $log.info('User authenticaed go to next route ' + $scope.nextRoute);
                            // call calllback
                            $scope.callback.call(this);
                            // $scope.callback.apply(this, ['Hi', 3, 2, 1]);
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
                        $log.debug('event:auth-loginRequired', data);
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
