/*jshint unused: vars */
define(['angular', 'controllers/main', 'controllers/bootstrap', 'controllers/banner', 'controllers/conversation', 'controllers/raphael', , 'controllers/fabric', 'controllers/fabric2', 'controllers/upload', 'controllers/splash/mobile', 'controllers/splash/facebook', 'controllers/splash/custom', 'controllers/login', 'filters/comatonewline', 'filters/splitintolines', 'directives/authapplication', 'directives/bannercreator', 'directives/uploadimage', 'services/authresource', 'services/banner', 'services/postermobile'] /*deps*/ , function(angular) /*invoke*/ {
    'use strict';

    return angular.module('bannerAppApp', [
            'bannerAppApp.controllers.MainCtrl',
            'bannerAppApp.controllers.BootstrapCtrl',
            'bannerAppApp.controllers.BannerCtrl',
            'bannerAppApp.controllers.ConversationCtrl',
            'bannerAppApp.controllers.RaphaelCtrl',
            'bannerAppApp.controllers.FabricCtrl',
            'bannerAppApp.controllers.Fabric2Ctrl',
            'bannerAppApp.controllers.UploadCtrl',
            'bannerAppApp.controllers.SplashMobileCtrl',
            'bannerAppApp.controllers.SplashFacebookCtrl',
            'bannerAppApp.controllers.SplashCustomCtrl',
            'bannerAppApp.controllers.LoginCtrl',

            'bannerAppApp.filters.Comatonewline',
            'bannerAppApp.filters.Splitintolines',

            'bannerAppApp.directives.Authapplication',
            'bannerAppApp.directives.Bannercreator',
            'bannerAppApp.directives.Uploadimage',

            'bannerAppApp.services.AuthResource',
            'bannerAppApp.services.Banner',
            'bannerAppApp.services.Postermobile',
            /*angJSDeps*/
            'ngRoute',
            'ngCookies',
            'ngResource',
            'ngSanitize',
            'http-auth-interceptor',
            'angularFileUpload',

            'ngAnimate',

            'ui.bootstrap',
            'ui.utils',
            'angularSpinkit',
            // 'snap',
            // 'jdFontselect',
            'slidePushMenu'
        ])
        .constant('jdFontselectConfig', {
            googleApiKey: 'AIzaSyDmr0hhRfQxivG5Hh4aD8SSd9yXvkZz8HQ'
        })
        .constant('BASEURL', 'http://dev.angularjs/_learn_/require-angular-banner-creator')
        .directive('bindUnsafeHtml', ['$compile',
            function($compile) {
                return function(scope, element, attrs) {
                    scope.$watch(
                        function(scope) {
                            // watch the 'bindUnsafeHtml' expression for changes
                            return scope.$eval(attrs.bindUnsafeHtml);
                        },
                        function(value) {
                            // when the 'bindUnsafeHtml' expression changes
                            // assign it into the current DOM
                            element.html(value);

                            // compile the new DOM and link it to the current
                            // scope.
                            // NOTE: we only compile .childNodes so that
                            // we don't get into infinite loop compiling ourselves
                            $compile(element.contents())(scope);
                        }
                    );
                }
            }
        ])
        .config(['$compileProvider', '$routeProvider', '$locationProvider',
            function($compileProvider, $routeProvider, $locationProvider) {
                // compile sanitazion
                $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|blob):/);
                $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
                // route
                $routeProvider
                    .when('/', {
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl'
                    })
                    .when('/bootstrap', {
                        templateUrl: 'views/bootstrap.html',
                        controller: 'BootstrapCtrl'
                    })
                    /* facebook */
                    .when('/facebook/banner', {
                        templateUrl: 'views/banner.html',
                        controller: 'BannerCtrl'
                    })
                    .when('/facebook/conversation', {
                        templateUrl: 'views/conversation.html',
                        controller: 'ConversationCtrl'
                    })
                    /* splash/poster */
                    .when('/splash/mobile', {
                      templateUrl: 'views/mobile.html',
                      controller: 'SplashMobileCtrl'
                    })
                    .when('/splash/facebook', {
                      templateUrl: 'views/splash/facebook.html',
                      controller: 'SplashFacebookCtrl'
                    })
                    .when('/splash/custom', {
                      templateUrl: 'views/splash/custom.html',
                      controller: 'SplashCustomCtrl'
                    })
                    .when('/svg/raphael', {
                        templateUrl: 'views/raphael.html',
                        controller: 'RaphaelCtrl',
                        resolve: {
                            delay: function($q, $timeout, $rootScope) {
                                console.log('delay');
                                
                                $rootScope.isLoading = true;
                                var delay = $q.defer();
                                $timeout(function() {
                                    $rootScope.isLoading = false;
                                    delay.resolve();
                                }, 1000);
                                return delay.promise;
                            }
                        }
                    })
                    .when('/svg/fabric', {
                        templateUrl: 'views/fabric.html',
                        controller: 'FabricCtrl'
                    })
                    .when('/svg/fabric2', {
                      templateUrl: 'views/fabric2.html',
                      controller: 'Fabric2Ctrl'
                    })
                    .when('/module/ng-file-upload', {
                      templateUrl: 'views/upload.html',
                      controller: 'UploadCtrl'
                    })
                    .when('/login', {
                      templateUrl: 'views/login.html',
                      controller: 'LoginCtrl'
                    })
                    .otherwise({
                        redirectTo: '/'
                    });

                // $locationProvider
                //     .html5Mode(false)
                //     .hashPrefix('!');
            }
        ])
        .run(['$rootScope', '$window', '$timeout', /*'snapRemote',*/
            function($rootScope, $window, $timeout /*, snapRemote*/ ) {
                $rootScope.user = null;
                // sidemenu
                $rootScope.menus = {
                    top: {
                        model: null,
                        template: null
                    },
                    left: {
                        model: null,
                        template: null
                    },
                    right: {
                        model: null,
                        template: null
                    }
                };

                $window.addEventListener('resize', function() {
                    $rootScope.$digest();
                });
                /*
                $rootScope.$watch(
                    function() {
                        return window.innerWidth;
                    },
                    function(newVal) {
                        snapRemote.getSnapper().then(function(snapper) {
                            var val = parseInt(newVal * 80 / 100);
                            snapper.settings({
                                maxPosition: val,
                                minPosition: -val
                            });
                            $timeout(function() {
                                $('.snap-drawer').css({
                                    'width': val + 'px'
                                });
                            }, 400)
                        });
                    }
                );
                */

                // http://tgeorgiev.blogspot.com/2013/11/animate-ngview-transitions-in-angularjs.html
                var oldLocation = '';
                $rootScope.$on('$routeChangeStart', function(angularEvent, next) {
                    console.log("routeChangeStart:event", angularEvent);
                    console.log("routeChangeStart:next", next);

                    var isLogin = next.$$route.originalPath == '/login';
                    $rootScope.isLogin = isLogin;
                    if( !isLogin ) $rootScope.$broadcast('event:auth-ping');
                    
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
            }
        ]);
});