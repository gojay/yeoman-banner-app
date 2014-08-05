/*jshint unused: vars */
define(['angular', 'controllers/main', 'controllers/bootstrap', 'controllers/banner', 'controllers/conversation', 'controllers/raphael', 'filters/comatonewline', 'filters/splitintolines', 'services/banner', 'directives/bannercreator', 'controllers/fabric'] /*deps*/ , function(angular) /*invoke*/ {
    'use strict';

    return angular.module('bannerAppApp', [
            'bannerAppApp.controllers.MainCtrl',
            'bannerAppApp.controllers.BootstrapCtrl',
            'bannerAppApp.controllers.BannerCtrl',
            'bannerAppApp.controllers.ConversationCtrl',
            'bannerAppApp.controllers.RaphaelCtrl',
            'bannerAppApp.filters.Comatonewline',
            'bannerAppApp.filters.Splitintolines',
            'bannerAppApp.services.Banner',
            'bannerAppApp.directives.Bannercreator',
            'bannerAppApp.controllers.FabricCtrl',
            /*angJSDeps*/
            'ngCookies',
            'ngResource',
            'ngSanitize',
            'ngRoute',

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
        .directive('bindUnsafeHtml', ['$compile',
            function($compile) {
                return function(scope, element, attrs) {
                    console.log('scope', scope)
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
        .config(function($routeProvider, $locationProvider) {
            // compile sanitazion
            // $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file):/);
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
                .when('/fabric', {
                    templateUrl: 'views/fabric.html',
                    controller: 'FabricCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });

            // $locationProvider
            //     .html5Mode(false)
            //     .hashPrefix('!');
        })
        .run(['$rootScope', '$window', '$timeout', /*'snapRemote',*/
            function($rootScope, $window, $timeout /*, snapRemote*/ ) {
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

                $rootScope.$watch(
                    function() {
                        return window.innerWidth;
                    },
                    function(newVal) {
                        /*
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
                        */
                    }
                );

                // http://tgeorgiev.blogspot.com/2013/11/animate-ngview-transitions-in-angularjs.html
                var oldLocation = '';
                $rootScope.$on('$routeChangeStart', function(angularEvent, next) {
                    console.log("routeChangeStart:event", angularEvent);
                    console.log("routeChangeStart:next", next);
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