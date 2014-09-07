define(['angular'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.controllers.SplashFacebookCtrl', [])
    .controller('SplashFacebookCtrl', function ($scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    });
});
