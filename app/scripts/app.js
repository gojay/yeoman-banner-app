/*jshint unused: vars */
define(['angular', 'controllers/main', 'controllers/bootstrap', 'controllers/banner', 'controllers/conversation', 'controllers/raphael', , 'controllers/fabric', 'controllers/fabric2', 'controllers/upload', 'controllers/splash/mobile', 'controllers/splash/facebook', 'controllers/splash/custom', 'controllers/login', 'controllers/pusher', 'controllers/test', 'controllers/test2', 'filters/comatonewline', 'filters/splitintolines', 'directives/authapplication', 'directives/bannercreator', 'directives/uploadimage', 'services/authresource', 'services/banner', 'services/postermobile'] /*deps*/ , function(angular) /*invoke*/ {
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
            'bannerAppApp.controllers.PusherCtrl',
            'bannerAppApp.controllers.TestCtrl',
            'bannerAppApp.controllers.Test2Ctrl',

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
            'angularjs-gravatardirective',

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
        .constant('PUSHER', {
            config: {
                appID: '89723',
                appKey: '43fd3eef0863aaee13db',
                appSecret: 'fb0125d8a8073f280f4e',
            },
            channel: {
                private : 'private-messages',
                presence: 'presence-messages'
            }
        })
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
        .directive('clickLink', ['$location', function($location) {
            return {
                link: function(scope, element, attrs) {
                    element.on('click', function() {
                        scope.$apply(function() {
                            $location.path(attrs.clickLink);
                        });
                    });
                }
            }
        }])
        .config(['$compileProvider', '$routeProvider', '$locationProvider', '$logProvider',
            function($compileProvider, $routeProvider, $locationProvider, $logProvider) {

                $logProvider.debugEnabled(true);

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
                        controller: 'SplashMobileCtrl',
                        resolve: {
                            mobile: function($rootScope, RecentMobiles){
                                $rootScope.isLoading = true;
                                return RecentMobiles().then(function(data){
                                    $rootScope.isLoading = false;
                                    return {
                                        all: data,
                                        detail: null
                                    }
                                });
                            }
                        }
                    })
                    .when('/splash/mobile/:mobileId', {
                        templateUrl: 'views/mobile.html',
                        controller: 'SplashMobileCtrl',
                        resolve: {
                            mobile: function($rootScope, RecentMobiles, DetailMobile){
                                $rootScope.isLoading = true;
                                return RecentMobiles().then(function(all){
                                    return DetailMobile().then(function(detail){
                                        $rootScope.isLoading = false;
                                        return {
                                            all   : all,
                                            detail: detail
                                        };
                                    });
                                });
                            }
                        }
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
                    .when('/pusher', {
                      templateUrl: 'views/pusher.html',
                      controller: 'PusherCtrl'
                    })
                    .when('/test', {
                      templateUrl: 'views/test.html',
                      controller: 'TestCtrl'
                    })
                    .when('/test2', {
                      templateUrl: 'views/test2.html',
                      controller: 'Test2Ctrl'
                    })
                    .otherwise({
                        redirectTo: '/'
                    });

                // $locationProvider
                //     .html5Mode(false)
                //     .hashPrefix('!');
            }
        ])
        .run(['$rootScope', '$cookieStore', '$window', '$timeout', /*'snapRemote',*/
            function($rootScope, $cookieStore, $window, $timeout /*, snapRemote*/ ) {
                $rootScope.safeApply = function(fn) {
                    var phase = this.$root.$$phase;
                    if(phase == '$apply' || phase == '$digest') {
                        if(fn && (typeof(fn) === 'function')) {
                        fn();
                        }
                    } else {
                        this.$apply(fn);
                    }
                };

                $rootScope.auth = $cookieStore.get('user');
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

                // http://tgeorgiev.blogspot.com/2013/11/animate-ngview-transitions-in-angularjs.html
                var oldLocation = '';
                $rootScope.$on('$routeChangeStart', function(event, next) {
                    // console.log("routeChangeStart:event", event);
                    // console.log("routeChangeStart:next", next);

                    // $rootScope.isLogin = next.$$route.originalPath == '/login';
                    $rootScope.isLogin = false;
                    if( angular.isDefined(next.$$route.controller) && next.$$route.controller != 'LoginCtrl' ) 
                        $rootScope.$broadcast('event:auth-ping');
                    
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