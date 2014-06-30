// https://github.com/ElbertF/Raphael.JSON#rapha%C3%ABljson-and-rapha%C3%ABlfreetransform
define(['angular', 'raphael', 'raphael-filter', 'raphael-transform', 'raphael-json', 'raphael-group'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.controllers.RaphaelCtrl', [])
        .controller('RaphaelCtrl', ['$scope', '$rootScope', '$sce', '$compile', '$timeout', 'Banner',
            function($scope, $rootScope, $sce, $compile, $timeout, Banner) {
                window.$scope = $scope;

                $rootScope.menus.left = {
                    model: ['itemA', 'itemB', 'itemC'],
                    template: '<div class="row"><ul class="list-group"><li class="list-group-item" ng-repeat="item in menus.left.model">{{item}}</li></ul></div>'
                };
                $rootScope.menus.right = {
                    model: ['itemA', 'itemB', 'itemC'],
                    template: '<div class="row"><ul class="list-group"><li class="list-group-item" ng-repeat="item in menus.left.model">{{item}}</li></ul></div>'
                };

                $scope.banner = Banner.dummy();

                $scope.loading = false;

                var paper = Raphael('canvas', 810, 380);

                // add definition styles for foreignObject HTML
                var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
                var css = "svg{background-color:#FFF}body{background-color:transparent}.foreign-object-0 h2{text-align:left;color:#FFF;font-family:Rockwell;font-weight:400;font-size:27px;line-height:32px;margin:0;padding:10px 20px;border-bottom:none}.foreign-object-0 h2~p{text-align:left;color:#FFF;font-family:Arial;font-size:13px;line-height:16px;margin:0;padding:0 20px}";
                var style = document.createElement('style');
                style.type = 'text/css';
                style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css));
                defs.appendChild(style);
                paper.canvas.insertBefore(defs, paper.defs);

                /* Background */

                var background = paper.image(
                    '{{ banner.background.image }}',
                    $scope.banner.background.attrs.x, $scope.banner.background.attrs.y, // x,y
                    $scope.banner.background.attrs.w, $scope.banner.background.attrs.h // width, height
                ).click(onClickHandler);

                var fb = paper.image(
                    '{{ banner.fb.image }}',
                    $scope.banner.fb.attrs.x, $scope.banner.fb.attrs.y,
                    $scope.banner.fb.attrs.w, $scope.banner.fb.attrs.h
                ).click(onClickHandler);
                fb.node.id = 'fb';

                var gBg = paper.group();
                gBg.push(background).push(fb);
                gBg.node.id = 'group-background';

                /* Logo */

                var placeholder = paper.rect(
                    $scope.banner.logo.attrs.x - 5,
                    $scope.banner.logo.attrs.y - 5,
                    $scope.banner.logo.attrs.w + 10,
                    $scope.banner.logo.attrs.h + 10
                ).attr({
                    fill: 'white'
                }).shadow(0, 1, 4, 0.6).click(onClickHandler);
                placeholder.node.id = 'logo-placeholder';
                var logo = paper.image(
                    '{{ banner.logo.image }}',
                    $scope.banner.logo.attrs.x, $scope.banner.logo.attrs.y,
                    $scope.banner.logo.attrs.w, $scope.banner.logo.attrs.h
                ).click(onClickHandler);
                logo.node.id = 'logo-image';
                var gLogo = paper.group();
                gLogo.push(placeholder).push(logo);
                gLogo.node.id = 'group-logo';

                /* Text */

                var placeText = paper.rect(
                    $scope.banner.text.attrs.place.x,
                    $scope.banner.text.attrs.place.y,
                    $scope.banner.text.attrs.place.w,
                    $scope.banner.text.attrs.place.h
                ).attr({
                    'fill': 'black',
                    'fill-opacity': 0.75
                }).click(onClickHandler);
                placeText.node.id = 'text-place';

                var textHtml = paper.foreignObject('<h2 ng-bind-html="banner.text.html.title|comaToNewLine"></h2><p ng-bind-html="banner.text.html.description"></p>',
                    $scope.banner.text.attrs.html.x,
                    $scope.banner.text.attrs.html.y,
                    $scope.banner.text.attrs.html.w,
                    $scope.banner.text.attrs.html.h,
                    'foreign-object-0'
                );
                textHtml.node.id = 'text-html';
                textHtml.click(onClickHandler);
                // grouping place & text
                var gText = paper.group();
                gText.push(placeText).push(textHtml);
                gText.node.id = 'group-text';

                function onClickHandler(e) {
                    var el = e.target,
                        id = el.id;

                    console.log(el)

                    var selected = null;
                    if (/fb/.test(id)) {
                        selected = 'fb';
                    } else if (/logo/.test(id)) {
                        selected = 'logo';
                    } else if (/text/.test(id) || el instanceof HTMLElement) {
                        selected = 'text';
                    } else {
                        selected = null;
                    }

                    angular.forEach(fts, function(ft) {
                        ft.hideHandles();
                    });

                    if (selected) {
                        elFts[selected].showHandles();
                    } else {
                        $scope.draw = null;
                    }

                    $scope.banner.selected = selected;
                    $scope.$apply();
                };

                var json = '[{"data":{"ft":{}},"type":"image","attrs":{"x":0,"y":0,"width":810,"height":380,"src":"{{ background }}"},"transform":"","id":0},{"data":{"ft":{"attrs":{"x":603,"y":5,"size":{"x":207,"y":54},"center":{"x":706.5,"y":32},"rotate":0,"scale":{"x":1,"y":1},"translate":{"x":-151,"y":38},"ratio":1}}},"type":"image","attrs":{"x":603,"y":5,"width":207,"height":54,"src":"{{ fb }}"},"transform":"t-151,38","id":1},{"data":{"ft":{}},"type":"rect","attrs":{"x":20,"y":5,"width":170,"height":110,"r":0,"rx":0,"ry":0,"fill":"white","stroke":"#000"},"transform":"","id":2},{"data":{"ft":{}},"type":"image","attrs":{"x":25,"y":10,"width":160,"height":100,"src":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBl…NZF2VC4AGR3oopGkQJ28DoetMkO04HpRRQXHcruSRUMhOaKKaOmBDKSPxqjd9x7UUVpE6qZ//Z"},"transform":"","id":"logo-image"},{"data":{"ft":{}},"type":"rect","attrs":{"x":20,"y":128,"width":404,"height":232,"r":0,"rx":0,"ry":0,"fill":"black","stroke":"#000","fill-opacity":0.75},"transform":"","id":4},{"data":{"ft":{}},"type":"foreignObject","attrs":{"x":20,"y":128,"width":404,"height":232},"transform":"","id":5}]';

                // Transform fb
                var ftFb = paper.freeTransform(fb, {
                    keepRatio: ['axisX', 'axisY', 'bboxCorners', 'bboxSides']
                }, onTransform).hideHandles();
                angular.extend(fb.freeTransform.attrs, $scope.banner.fb.transform);
                fb.freeTransform.apply();

                // Transform logo
                var gSetLogo = paper.set(placeholder, logo);
                var ftLogo = paper.freeTransform(gSetLogo, {
                    keepRatio: ['axisX', 'axisY', 'bboxCorners', 'bboxSides']
                }, onTransform).hideHandles();
                angular.extend(gSetLogo.freeTransform.attrs, $scope.banner.logo.transform);
                gSetLogo.freeTransform.apply();

                // Transform text
                var gSetText = paper.set(placeText, textHtml);
                var ftText = paper.freeTransform(gSetText, {
                    keepRatio: ['axisX', 'axisY', 'bboxCorners', 'bboxSides']
                }, onTransform).hideHandles();

                function onTransform(ft, events) {
                    if (/end/.test(events.toString())) {
                        var id = ft.items[0].el.node.id;
                        console.info(id);
                        console.log(JSON.stringify(ft.attrs));

                        if (/text/.test(id)) {
                            $scope.banner.text.transform = ft.attrs;
                        } else if (/logo/.test(id)) {
                            $scope.banner.logo.transform = ft.attrs;
                        } else if (/fb/.test(id)) {
                            $scope.banner.fb.transform = ft.attrs;
                        }
                        $scope.$apply();
                    }
                }

                var fts = [ftFb, ftLogo, ftText];
                var elFts = {
                    'fb': ftFb,
                    'logo': ftLogo,
                    'text': ftText,
                };

                $scope.$watch('draw', function(value) {
                    if (!elFts[$scope.banner.selected]) return;
                    elFts[$scope.banner.selected].setOpts({
                        draw: [value == 'bbox' ? 'bbox' : null, value == 'circle' ? 'circle' : null]
                    });
                });

                // compile scope to svg
                $compile(paper.canvas)($scope);

                window.paper = paper;

            }
        ]);
});