// https://github.com/ElbertF/Raphael.JSON#rapha%C3%ABljson-and-rapha%C3%ABlfreetransform
define(['angular', 'angular-font-select', 'raphael', 'raphael-filter', 'raphael-transform', 'raphael-json', 'raphael-group'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.controllers.RaphaelCtrl', ['jdFontselect'])
        .controller('RaphaelCtrl', ['$scope', '$rootScope', '$compile', '$timeout', 'Banner',
            function($scope, $rootScope, $compile, $timeout, Banner) {
                window.$scope = $scope;

                $scope.isFirstOpen = true;

                $rootScope.menus.left = {
                    model: ['itemA', 'itemB', 'itemC'],
                    template: '<div style="padding-top: 60px;"><ul class="list-group"><li class="list-group-item" ng-repeat="item in menus.left.model">{{item}}</li></ul></div>'
                };
                $rootScope.menus.right = {
                    model: ['itemA', 'itemB', 'itemC'],
                    template: '<div style="padding-top: 60px;"><ul class="list-group"><li class="list-group-item" ng-repeat="item in menus.left.model">{{item}}</li></ul></div>'
                };

                $scope.banner = Banner.dummy;

                /**
                 * convert SVG to Image
                 * there are some issues, and only work on firefox
                 */
                function svgToImage(svg, callback) {
                    // get canvas context
                    try {
                        var svg_xml = (new XMLSerializer()).serializeToString(svg);
                        open("data:image/svg+xml," + encodeURIComponent(svg_xml));
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext("2d");
                        var img = new Image();
                        img.onload = function() {
                            canvas.width = this.width;
                            canvas.height = this.height;
                            ctx.drawImage(this, 0, 0);
                            console.log('this', this);
                            var imgDataURI = canvas.toDataURL('image/png');
                            callback(this, imgDataURI);
                        };
                        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg_xml)));

                    } catch (e) {
                        console.log(e);
                    }
                };

                /**
                 * convert data URI to Blob
                 */
                var dataURItoBlob = function(dataURI) {
                    var byteString;
                    if (dataURI.split(',')[0].indexOf('base64') >= 0)
                        byteString = atob(dataURI.split(',')[1]);
                    else
                        byteString = unescape(dataURI.split(',')[1]);
                    var array = [];
                    for (var i = 0; i < byteString.length; i++) {
                        array.push(byteString.charCodeAt(i));
                    }

                    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                    return new Blob([new Uint8Array(array)], {
                        type: mimeString
                    });
                };

                $scope.banner.generate = function() {
                    var svg = angular.element('#canvas-1').find('svg')[0];
                    console.log('generate', svg);
                    svgToImage(svg, function(img, imgDataURI) {
                        console.log('data uri', imgDataURI);
                        $scope.banner.imgPreview = imgDataURI;
                        $scope.$apply();
                        var imgBlob = dataURItoBlob(imgDataURI);
                    });
                };

            }
        ]);
});