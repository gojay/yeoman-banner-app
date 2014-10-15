define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.controllers.TestCtrl', [])
        .controller('TestCtrl', ['$scope', '$cookieStore', '$location', '$log', '$http', 'APIURL',  
            function($scope, $cookieStore, $location, $log, $http, APIURL) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.user = $cookieStore.get('user');

            $scope.store = function() {
                $cookieStore.put('user', $scope.user);
                $location.path('/test2');
            };
            $scope.get = function() {
                return $cookieStore.get('user');
            };

            var api = APIURL + '/contacts';
            $http({
                method: 'POST',
                url: api,
                data: {
                    'page': 1,
                    'per_page': 5
                },
                headers: {
                    // Authorization: 'Basic ' + btoa('MyVeryLongAPIKey:password')
                }
                // withCredentials: true
            }).success(function(data, status, headers, config) {

                $log.debug('data', data);
                $log.debug('status', status);
                $log.debug('link', $scope.$parent.parseLinkHeader(headers('Link')));
                $log.debug('config', config);

            }).error(function(data, status, headers, config) {
                $log.error(data);
                $log.error(status);
                $log.error(headers);
                $log.error(config);
            });

        }]);
});
