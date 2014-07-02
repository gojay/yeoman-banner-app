// https://github.com/ElbertF/Raphael.JSON#rapha%C3%ABljson-and-rapha%C3%ABlfreetransform
define(['angular', 'raphael', 'raphael-filter', 'raphael-transform', 'raphael-json', 'raphael-group'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.controllers.RaphaelCtrl', [])
        .controller('RaphaelCtrl', ['$scope', '$rootScope', '$compile', '$timeout', 'Banner',
            function($scope, $rootScope, $compile, $timeout, Banner) {
                window.$scope = $scope;

                $scope.isFirstOpen = true;

                $rootScope.menus.left = {
                    model: ['itemA', 'itemB', 'itemC'],
                    template: '<div class="row"><ul class="list-group"><li class="list-group-item" ng-repeat="item in menus.left.model">{{item}}</li></ul></div>'
                };
                $rootScope.menus.right = {
                    model: ['itemA', 'itemB', 'itemC'],
                    template: '<div class="row"><ul class="list-group"><li class="list-group-item" ng-repeat="item in menus.left.model">{{item}}</li></ul></div>'
                };

                $scope.banner = Banner.dummy();

                $('.p').popover({
                    placement: 'top'
                });

            }
        ]);
});