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
            'slidePushMenu',

            'chieffancypants.loadingBar'
        ])
        .constant('jdFontselectConfig', {
            googleApiKey: 'AIzaSyDmr0hhRfQxivG5Hh4aD8SSd9yXvkZz8HQ'
        })
        .constant('APP', {
            'ID': '1413098344',
            'SECRET': '66a3eb9d8de587d82e951fbaa69bdb080543a2208'
        })
        .constant('APIURL', 'http://api/banner-api/public/api/v1') // 'http://localhost:8080/api/v1
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
        .config(['$compileProvider', '$routeProvider', '$locationProvider', '$logProvider', 'cfpLoadingBarProvider',
            function($compileProvider, $routeProvider, $locationProvider, $logProvider, cfpLoadingBarProvider) {
                // $log debug enable/disable
                $logProvider.debugEnabled(true);

                cfpLoadingBarProvider.includeSpinner = true;

                // compile sanitazion
                $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|blob):/);
                $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);

                var pingResolver = {
                    delay: function($q, $timeout, $rootScope, authResource) {
                        var deferred = $q.defer();
                        $rootScope.$broadcast('event:auth-ping', function(){
                            deferred.resolve();
                        });
                        return deferred.promise;
                    }
                };
                // route
                $routeProvider
                    .when('/', {
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl'
                    })
                    /* facebook */
                    .when('/facebook/banner', {
                        templateUrl: 'views/banner.html',
                        controller: 'BannerCtrl',
                        resolve: pingResolver
                    })
                    .when('/facebook/conversation', {
                        templateUrl: 'views/conversation.html',
                        controller: 'ConversationCtrl',
                        resolve: pingResolver
                    })
                    /* splash/poster */
                    .when('/splash/mobile', {
                        templateUrl: 'views/mobile.html',
                        controller: 'SplashMobileCtrl',
                        resolve: {
                            mobile: function($rootScope, $q, $log, RecentMobiles) {
                                var deferred = $q.defer();

                                RecentMobiles().then(function(data){
                                    $rootScope.isLoading = false;

                                    $log.debug('resolve recent mobiles', data);

                                    deferred.resolve({
                                        all: data,
                                        detail: null
                                    });
                                });

                                return deferred.promise;
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
                                var delay = $q.defer();
                                $timeout(function() {
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
                        controller: 'PusherCtrl',
                        resolve: pingResolver
                    })
                    .when('/bootstrap', {
                        templateUrl: 'views/bootstrap.html',
                        controller: 'BootstrapCtrl'
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
            }
        ])
        .run(['$rootScope', '$cookieStore', '$window', '$timeout', /*'snapRemote',*/
            function($rootScope, $cookieStore, $window, $timeout /*, snapRemote*/ ) {

                $window.addEventListener('resize', function() {
                    $rootScope.$digest();
                });
                
                // safe applying scope
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

                // parse Link Headers
                $rootScope.parseLinkHeader = function (value) {

                    if(!value) return;

                    var linkexp = /<[^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|$)/g;
                    var paramexp = /[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g;

                    var unquote = function(value) {
                        if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                            return value.substring(1, value.length - 1);
                        }
                        return value;
                    }

                    var matches = value.match(linkexp);
                    var rels = {},
                        titles = {};
                    for (var i = 0; i < matches.length; i++) {
                        var split = matches[i].split('>');
                        var href = split[0].substring(1);
                        var ps = split[1];

                        var link = {};
                        link.href = href;
                        var s = ps.match(paramexp);
                        for (var j = 0; j < s.length; j++) {
                            var p = s[j];
                            var paramsplit = p.split('=');
                            var name = paramsplit[0];
                            link[name] = unquote(paramsplit[1]);
                        }

                        if (link.rel !== undefined) {
                            rels[link.rel] = link;
                        }
                        if (link.title !== undefined) {
                            titles[link.title] = link;
                        }
                    }

                    var linkheader = {};
                    linkheader.rels = rels;
                    linkheader.titles = titles;
                    return linkheader;
                }

                $rootScope.nextRoute = '/';
                // user info authenticated
                $rootScope.openLoginDialog = false;
                $rootScope.user = angular.fromJson(localStorage.getItem('user')) || false;
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

                var oldLocation = '';
                $rootScope.$on('$routeChangeStart', function(event, next) {
                    $rootScope.isLogin = angular.isDefined(next.$$route) && next.$$route.originalPath == '/login';
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
                $rootScope.$on('cfpLoadingBar:progress', function(data, percent){
                    angular.element('#view.container').css('opacity', Math.round(percent) / 100);
                });
                $rootScope.$on('cfpLoadingBar:completed', function(data, percent){
                    // console.info('cfpLoadingBar:completed');
                    $rootScope.loading = false;
                });
            }
        ]);
});