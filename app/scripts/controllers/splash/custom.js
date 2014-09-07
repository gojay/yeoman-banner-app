define(['angular'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.controllers.SplashCustomCtrl', [])
    .controller('SplashCustomCtrl', function ($scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    });
});
