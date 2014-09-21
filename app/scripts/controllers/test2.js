define(['angular'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.controllers.Test2Ctrl', [])
    .controller('Test2Ctrl', function ($scope, $cookieStore, $location) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];

      		$scope.user = $cookieStore.get('user');

  			$scope.store = function(){
                $cookieStore.put('user', $scope.user);
                $location.path( "/test" );
            };
            $scope.get = function(){
                return $cookieStore.get('user');
            };
    });
});
