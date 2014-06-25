/*jshint unused: vars */
define(['angular', 'controllers/main', 'controllers/bootstrap', 'controllers/banner']/*deps*/, function (angular, MainCtrl, BootstrapCtrl, BannerCtrl)/*invoke*/ {
  'use strict';

  return angular.module('bannerAppApp', ['bannerAppApp.controllers.MainCtrl',
'bannerAppApp.controllers.BootstrapCtrl',
'bannerAppApp.controllers.BannerCtrl',
/*angJSDeps*/
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',

  'ngAnimate',

  'ui.bootstrap',
  'ui.utils'
])
    .config(function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
        .when('/bootstrap', {
          templateUrl: 'views/bootstrap.html',
          controller: 'BootstrapCtrl'
        })
        .when('/facebook/banner', {
          templateUrl: 'views/banner.html',
          controller: 'BannerCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });

      // $locationProvider
      //     .html5Mode(false)
      //     .hashPrefix('!');
    });
});
