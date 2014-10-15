define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.directives.Authapplication', [])
        .directive('authApplication', ['$rootScope', '$log', '$timeout', '$location', '$cookieStore', 'authResource', 'authService',
            function($rootScope, $log, $timeout, $location, $cookieStore, authResource, authService) {
            return {
                restrict: 'C',
                link: function postLink($scope, $element, $attrs) {

                    var callback  = null;

                    // authorization ping
                    $scope.$on('event:auth-ping', function(event, callback) {
                        $log.debug('event:auth-ping', $scope.$root.nextRoute);

                        var user = $cookieStore.get('user');
                        $log.debug('user', user);

                        // set callback
                        callback = callback;

                        authResource.authentifiedRequest('GET', '/auth/ping', {}, function(){
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
                        $cookieStore.remove('user');
                        $cookieStore.remove('oauth');
                        $rootScope.user = null;
                        // redirect to login
                        $location.path( "/login" );
                    });
                    
                }
            };
        }]);
});
