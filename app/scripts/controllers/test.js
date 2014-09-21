define(['angular'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.controllers.TestCtrl', [])
    .controller('TestCtrl', function ($scope, $cookieStore, $location) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];

            $scope.user = $cookieStore.get('user');

  			$scope.store = function(){
                $cookieStore.put('user', $scope.user);
                $location.path( "/test2" );
            };
            $scope.get = function(){
                return $cookieStore.get('user');
            };
    });
});
