/*jshint unused: vars */
define(['angular', 'controllers/main', 'controllers/bootstrap', 'controllers/banner', 'controllers/conversation', 'controllers/raphael', 'filters/comatonewline', 'filters/splitintolines', 'services/banner'] /*deps*/ , function(angular, MainCtrl, BootstrapCtrl, BannerCtrl, ConversationCtrl, RaphaelCtrl, ComatonewlineFilter) /*invoke*/ {
    'use strict';

    return angular.module('bannerAppApp', ['bannerAppApp.controllers.MainCtrl',
        'bannerAppApp.controllers.BootstrapCtrl',
        'bannerAppApp.controllers.BannerCtrl',
        'bannerAppApp.controllers.ConversationCtrl',
        'bannerAppApp.controllers.RaphaelCtrl',
        'bannerAppApp.filters.Comatonewline',
        'bannerAppApp.filters.Splitintolines',
        'bannerAppApp.services.Banner',
/*angJSDeps*/
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',

        'ngAnimate',

        'ui.bootstrap',
        'ui.utils',
        'angularSpinkit',
        'snap'
    ])
    .config(function($routeProvider, $locationProvider) {
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
            .when('/facebook/conversation', {
                templateUrl: 'views/conversation.html',
                controller: 'ConversationCtrl'
            })
            .when('/raphael', {
              templateUrl: 'views/raphael.html',
              controller: 'RaphaelCtrl',
              resolve: {
                  delay: function($q, $timeout, $rootScope){
                    console.log('delay');
                    $rootScope.isLoading = true;
                    var delay = $q.defer();
                    $timeout(function(){
                      $rootScope.isLoading = false;
                      delay.resolve();
                    }, 1000);
                    return delay.promise;
                  }
              }
            })
            .otherwise({
                redirectTo: '/'
            });

        // $locationProvider
        //     .html5Mode(false)
        //     .hashPrefix('!');
    })
    .run(['$rootScope', '$window', 'snapRemote', function($rootScope, $window, snapRemote){

      $window.addEventListener('resize', function() {
        $rootScope.$digest();
      });

      $rootScope.$watch(
        function() {
          return window.innerWidth;
        },
        function(newVal) {
          snapRemote.getSnapper().then(function(snapper) {
            var val = newVal * 80/100;

            snapper.settings({
              maxPosition: val,
              minPosition:-val
            });
          });
        }
      );

      // http://tgeorgiev.blogspot.com/2013/11/animate-ngview-transitions-in-angularjs.html
      var oldLocation = '';
      $rootScope.$on('$routeChangeStart', function(angularEvent, next) {
        console.log("routeChangeStart");
        var isDownwards = true;
        if (next && next.$$route) {
          var newLocation = next.$$route.originalPath;
          if (oldLocation !== newLocation && oldLocation.indexOf(newLocation) !== -1) {
            isDownwards = false;
          }
          
          oldLocation = newLocation;
        }
        
        $rootScope.isDownwards = isDownwards;
      });
    }]);
});