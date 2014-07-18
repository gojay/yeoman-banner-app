define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.directives.Bannercreator', [])
        .directive('bannerCreator', function($rootScope, $compile, slidePush) {
            return {
                template: '<div></div>',
                restrict: 'E',
                scope: {
                    banner: '=ngModel'
                },
                replace: true,
                controller: ['$scope', '$attrs', '$rootScope', '$timeout',
                    function(scope, attrs, $rootScope, $timeout) {
                        scope.$watchCollection('banner.text.font', function(values) {
                            if (values.size < 8)
                                scope.banner.text.font.size = 8;
                            if (values.size > 64)
                                scope.banner.text.font.size = 64;
                            if (values.line < 8)
                                scope.banner.text.font.line = 8;
                            if (values.line > 64)
                                scope.banner.text.font.line = 64;
                        });

                        // update template top menu
                        $timeout(function() {
                            $rootScope.menus.top = {
                                model: scope.banner.text,
                                template: '<div ng-include src="\'views/banner-top-config.html\'"></div>'
                            };
                        }, 1000);

                        var ID = attrs.id,
                            tpl = attrs.tpl || 0,
                            svgHeight = null,
                            className = 'foreign-object-' + tpl;

                        switch (tpl) {
                            case '2':
                                var wH = {
                                    w: 332,
                                    h: 200,
                                    y: 340-200-10
                                };
                                // angular.extend(scope.banner.text.attrs, wH);
                                break;
                            case '3':
                                angular.extend(scope.banner.logo.attrs, {
                                    x: 40,
                                    y: scope.banner.logo.attrs.y + 20,
                                    w: 122,
                                    h: 80
                                });
                                // scope.banner.logo.image = "http://placehold.it/122x80";
                                scope.banner.fb.attrs.x = 583;
                                scope.banner.fb.attrs.y += 20;
                                var textAttrs = {
                                    x: 40,
                                    y: 165 + 10,
                                    w: 730,
                                    h: 130
                                };
                                // angular.extend(scope.banner.text.attrs, textAttrs);
                                break;
                            default:
                                break;
                        };

                        var paper = this.paper = Raphael(ID, 810, scope.banner.dimension[tpl].attrs.h);
                        angular.element(paper.canvas).attr('height','{{ banner.dimension['+ tpl +'].attrs.h }}');

                        this.tpl = tpl;

                        if (tpl == '3') {
                            paper.rect(0, 0, 810, svgHeight).attr({
                                fill: 'white',
                                stroke: 'none'
                            });
                            paper.image(
                                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAwEAAAASCAIAAACM10XqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkyNUI4NzNDQzJCRjExRTI5RTVBQTBFN0FBRUZEMzAwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkyNUI4NzNEQzJCRjExRTI5RTVBQTBFN0FBRUZEMzAwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTI1Qjg3M0FDMkJGMTFFMjlFNUFBMEU3QUFFRkQzMDAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTI1Qjg3M0JDMkJGMTFFMjlFNUFBMEU3QUFFRkQzMDAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6xYgy1AAAFIUlEQVR42uyca2/zKhCEk/b//+X2WEIvQiw7O8vFSXNmPkSuDesFX3gykD5/f38fUF0Br3xqf7vTFqh77AbYX7bbT7ABiuGSNg3vk0zJa0K7s8rrgZUzgjS6k9ajz+fTi3kdyl44fP+Et2L5tCkxAjfStMjq2efu5dqVTxin3ELr2hXntjTIknPtGtaqO3FM5qgtE+ZpK9rt8rYpT3c9em1/fX117xzQwBLBNrmraM/O1OoK11Ttqb2AXqo2MmgXuJpdEK+9IKWwT8AVBAXwofAuIsvH9yF+JZFj1QTo4AJ4jA/5JiSDYUkPIDwUwHWHJ/r5+QEpdRugUcPCw+0OaLy+8iK3R6+b6cq/0kabZG1X10VteYaBrvLX220YDcNcreslM4wzbA5+Ivjg78ZAR9lugjtPQ8MiA92PYosMVG5+pla950uVghQg+DByfdxCoGmfSrJKHZKvWt/f3y0A1Zj1SSwxn/8UMpBlAg8vbGEbs9voGMjjpyFYlM+rOeB0w3Z5qMSUBCmFvIgpZ4KW1vFoPwMdfdnx7hH/Z5aW1nkLOEZ2GzMQ4+t4TIMZCECbd0bLQB6ckQiLvbS6UUire1lj2892LwncwwvUft0E9IMTC9VG88YYHNDLM+yBzqvbwmenXSvb2NS3RgYvum6ZIBLbCe1RfJVDiGHGGBDEehWpUQpQkTdI1/6spOV5D8C34G0GZkS3kYdwYNEqPJEXB5MHiBl6J8DHYtwmvhjp26Usn7ln89BXl+edlvvKuaa/NzNzbSRspXgLF2YAC/NZdkJwjrowVz2IecmQk5h2Dat0qQ4NKhCt4A5Aja5utcEsaXk22FEfCBtX25/r0ADjuRMATXuUHI+ZcXq7kUPu9JqzxdYC8zKp+Ygyr2S7C7gLXYFSHcMKaQ8wA3A3NQZcHAZiJnAqBRYp1yQ1f4Q7kPdU+KMJc2XBRr15Fvv5bssO3sfAn5v1Y7wB8lCKMHic8uwoD0fIxUbTnpzHQKTJFCImuTOM0DFWOIN2moFCowhHHg7Yex+0xVVWcw75dHCvW/jcLEacY6Bw1QhmiC0zF0yclEuBw9rpPAwTYO1LSDAPM5e3vcdIYN1FJ9mFNX8UaD6Qgf4ES2VLrq8rX6SoOZjgl/XgP1PJl5cdCZE8da3AnDf/ODSlDtk8w1F2wuwcTuUMz4gnfcI2tvObwyB2fzv2WMcoHAC8ZmZLWt8l9d7fa+ODtatZy2GRSCZ28g4HH23aVmFwJMSOXWtWUrcKX8x7OXwSwYiB9qNSOHrdw2Eb5/6YwvwkIDBISLJ55NfaZwPyDMR7GMyPyMJZv4nrvshAG62pCT7LnmhueNjltdw2Sk2DkedtPJI/yQGjOz/MbynJWxRMrV0ZbseXLEwchY//A9mIgT7Qi7qBq6a9qL0kN7dSfh2SJjytxSbs6ueNDH0C1NYZKAtD4JvxIe7xeCI01aYzyYIF4CFL0t7OvVYH41WsrJmdW8uSvegnkEKYIgaSbmWpQ0S1XmsaJlaclWkC2ztnuuVyv0lKu9YDnSOkl9daHJvnzJXw0Lr11f7g7tC/M3gfl0XsIgaSRFf3nejoLw0Xmem2rn63/yR0NLdDbPFHY56e+7uhK14CDSIVSQwkfSBavSSxl7fungT+3IvinnHutaPph/1PbfGKJAaSJMGZ2qgxWG2UJDGQJAnU9IQKLyRJEgNJkiRJkiSJgSRJkiRJksRAkiRJkiRJYiBJkiRJkiQxkCRJkiRJUq//BBgAljy5Rhqp808AAAAASUVORK5CYII=',
                                20, 323, 780, 18);
                        }

                        // add definition styles for foreignObject HTML
                        var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
                        var css = {
                            0: "svg{background-color:#FFF}body{background-color:transparent}.foreign-object-0 h2{text-align:left;margin:0;padding:10px 20px;border-bottom:none}.foreign-object-0 h2~p{text-align:left;margin:0;padding:0 20px}",
                            1: "svg{background-color:#FFF}body{background-color:transparent}.foreign-object-1 h2{text-align:left;margin:0;padding:10px 20px;border-bottom:none}.foreign-object-1 h2~p{text-align:left;padding:0 20px}.foreign-object-prize-1 h2{margin:0;padding:3px 5px 0;text-align:center;border-bottom:none}.foreign-object-prize-1 span{display:block;text-align:center}.foreign-object-prize-1 p{width:340px;height:50px;padding:0 15px;text-align:center;vertical-align:middle;display:table-cell}.prize-black-text{color:#333!important}",
                            2: "svg{background-color:#FFF}body{background-color:transparent}.foreign-object-2 h2{text-align:left;margin:0;padding:10px 20px;border-bottom:none}.foreign-object-2 h2~p{text-align:left;padding:0 20px;top:10px}.foreign-object-prize-2 h2{margin:0;padding:3px 5px 0;text-align:center;border-bottom:none}.foreign-object-prize-2 span{display:block;text-align:center}.foreign-object-prize-2 p{width:203px;height:30px;padding:0 10px;text-align:center;vertical-align:middle;display:table-cell}.prize-black-text{color:#333!important}",
                            3: "svg{background-color:#FFF}body{background-color:transparent}.foreign-object-3 h2{float:left;width:40%;margin:0;padding:20px;border-bottom:none}.foreign-object-3 h2~p{padding:20px}.foreign-object-prize-3{text-align:center;}.foreign-object-prize-3 h2{margin:0;padding:0 5px;border-bottom:none}.foreign-object-prize-3 p{width:250px;height:67px;padding:0;vertical-align:middle;display:table-cell}.prize-black-text{color:#333!important}"
                        };
                        var _css = css[tpl];
                        var style = document.createElement('style');
                        style.type = 'text/css';
                        style.styleSheet ? style.styleSheet.cssText = _css : style.appendChild(document.createTextNode(_css));
                        defs.appendChild(style);
                        paper.canvas.insertBefore(defs, paper.defs);

                        this.createImage = function(params) {
                            var placeholder = null;
                            var x = (params.distance) ? params.model.attrs.x + params.distance.x : params.model.attrs.x;
                            var x = params.margin ? (params.model.attrs.x - 5) + (params.model.attrs.w + 10 + 2) + params.margin + 5 : x;
                            // placeholder
                            if (params.placeholder) {
                                var attrs = (params.attrs) ? params.attrs : {
                                    fill: 'white'
                                };
                                placeholder = paper.rect(
                                    x - 5,
                                    params.model.attrs.y - 5,
                                    params.model.attrs.w + 10,
                                    params.model.attrs.h + 10
                                ).attr(attrs);
                                if (params.id == 'logo') placeholder.shadow(0, 1, 4, 0.6)
                                if (params.onClick) {
                                    placeholder.click(params.onClick);
                                }

                                placeholder.node.id = params.id + '-placeholder-' + tpl;
                            }
                            // image
                            var image = paper.image(
                                params.value,
                                x, params.model.attrs.y, // x,y
                                params.model.attrs.w, params.model.attrs.h // width, height
                            );
                            image.node.id = params.id + '-image-' + tpl;
                            if (params.onClick) {
                                image.click(params.onClick);
                            }

                            return {
                                placeholder: placeholder,
                                image: image
                            };
                        };
                        this.createText = function(params) {
                            // placeholder
                            var placeholder = null;

                            var x = params.distance ? params.model.attrs.x + params.distance.x : params.model.attrs.x;
                            var x = params.margin   ? (params.model.attrs.x + 10) + (params.model.attrs.w + 2) + params.margin : x;

                            if (params.placeholder) {
                                placeholder = paper.rect(
                                    x, (params.model.placeholder.y) ? params.model.placeholder.y.value : params.model.attrs.y,
                                    params.model.attrs.w,
                                    params.height ? params.height : params.model.attrs.h
                                );
                                if (params.onClick) {
                                    placeholder.click(params.onClick);
                                }

                                var attrs = {
                                    'opacity': '{{ banner.' + params.title + '.placeholder.hide ? 0 : 1 }}',
                                    'fill': '{{ banner.' + params.title + '.placeholder.fill }}',
                                    'fill-opacity': '{{ banner.' + params.title + '.placeholder.opacity }}',
                                    'stroke': '{{ banner.' + params.title + '.placeholder.nostroke ? \'none\' : banner.' + params.title + '.placeholder.strokeColor }}',
                                    'stroke-width': '{{ banner.' + params.title + '.placeholder.strokeWidth }}'
                                };
                                if( params.title == 'text' ){
                                    var textAttrs = 'text.attrs['+ tpl +']';   
                                    attrs['x'] = '{{ banner.'+ textAttrs +'.x }}';
                                    attrs['y'] = '{{ banner.'+ textAttrs +'.y }}';
                                    attrs['width']  = '{{ banner.'+ textAttrs +'.w }}';
                                    attrs['height'] = '{{ banner.'+ textAttrs +'.h }}';
                                }
                                if (params.model.placeholder.y) {
                                    attrs['y'] = '{{ banner.' + params.title + '.placeholder.y.value }}';
                                }

                                angular.element(placeholder.node).attr(attrs);
                            }

                            // text html
                            if (/image/.test(params.title)) {
                                var html = '<p ng-bind-html="' + params.value + '" style="font-family:{{banner.' + params.title + '.font.family}}; color:{{banner.' + params.title + '.font.color}}; font-size: {{banner.' + params.title + '.font.description.size}}px; line-height: {{banner.' + params.title + '.font.description.line}}px"></p>'
                            } else {
                                var html = '<h2 ng-bind-html="banner.' + params.title + '.content.title|comaToNewLine" style="font-family: {{banner.' + params.title + '.font.family}}; font-size: {{banner.' + params.title + '.font.header.size}}px; line-height: {{banner.' + params.title + '.font.header.line}}px; color: {{banner.' + params.title + '.font.color}}"></h2>';
                                if (params.title == 'text') {
                                    html += '<p ng-bind-html="banner.' + params.title + '.content.description" style="font-family: {{banner.' + params.title + '.font.family}}; font-size: {{banner.' + params.title + '.font.description.size}}px; line-height: {{banner.' + params.title + '.font.description.line}}px; color: {{banner.' + params.title + '.font.color}}"></p>';
                                } else {
                                    html += '<span ng-bind-html="banner.' + params.title + '.content.description" style="font-family: {{banner.' + params.title + '.font.family}}; font-size: {{banner.' + params.title + '.font.description.size}}px; line-height: {{banner.' + params.title + '.font.description.line}}px; color: {{banner.' + params.title + '.font.color}}"></span>';
                                }
                            }

                            var text = paper.foreignObject(
                                html,
                                x, (params.model.placeholder.y) ? params.model.placeholder.y.value : params.model.attrs.y,
                                params.model.attrs.w,
                                params.height ? params.height : params.model.attrs.h, (params.className) ? params.className : className
                            );
                            if( params.title == 'text' ){
                                var textAttrs = 'text.attrs['+ tpl +']';
                                angular.element(text.node).attr({
                                    'x':'{{ banner.'+ textAttrs +'.x }}',
                                    'y':'{{ banner.'+ textAttrs +'.y }}',
                                    'width':'{{ banner.'+ textAttrs +'.w }}',
                                    'height':'{{ banner.'+ textAttrs +'.h }}'
                                });
                            }

                            if (params.model.placeholder.y) {
                                angular.element(text.node).attr('y', '{{ banner.' + params.title + '.placeholder.y.value }}');
                            }
                            if (params.onClick) {
                                text.click(params.onClick);
                            }

                            return {
                                placeholder: placeholder,
                                text: text
                            }
                        };
                        this.addToGroup = function(elements, id) {
                            var groups = paper.group();
                            angular.forEach(elements, function(element) {
                                groups.push(element);
                            });
                            if (id) groups.node.id = id;
                        };
                    }
                ],
                link: function(scope, element, attrs, ctrl) {

                    var ID = attrs.id,
                        className = attrs.className;
                    var paper = ctrl.paper,
                        tpl = ctrl.tpl;

                    /* Transform configuration */

                    var defaultOptions = {
                        keepRatio: ['axisX', 'axisY', 'bboxCorners', 'bboxSides']
                    };
                    var options = angular.copy(defaultOptions);
                    options.configOnClick = onClickHandlerConfigTransform;

                    /* Background */

                    var background = ctrl.createImage({
                        placeholder: false,
                        id: 'background',
                        value: '{{ banner.background['+tpl+'].image }}',
                        model: scope.banner.background[tpl],
                        onClick: onClickHandler
                    });

                    /* FB element */

                    var fb = ctrl.createImage({
                        placeholder: false,
                        id: 'fb',
                        value: '{{ banner.fb.image }}',
                        model: scope.banner.fb,
                        onClick: onClickHandler
                    });
                    // transform element
                    var gSetFB = paper.set(fb.image);
                    var ftFb = paper.freeTransform(gSetFB, defaultOptions, onTransform).hideHandles();
                    angular.extend(gSetFB.freeTransform.attrs, scope.banner.fb.transform);
                    gSetFB.freeTransform.apply();

                    /* Logo element */

                    var logo = ctrl.createImage({
                        placeholder: true,
                        id: 'logo',
                        value: '{{ banner.logo.image['+ tpl +'] }}',
                        model: scope.banner.logo,
                        onClick: onClickHandler
                    });
                    // transform element
                    var gSetLogo = paper.set(logo.image);
                    var ftLogo = paper.freeTransform(gSetLogo, defaultOptions, onTransform).hideHandles();
                    angular.extend(gSetLogo.freeTransform.attrs, scope.banner.logo.transform);
                    gSetLogo.freeTransform.apply();

                    // grouping elements: background, fb & logo
                    ctrl.addToGroup([background.image, fb.image, logo.placeholder, logo.image], 'group-image-' + tpl);

                    /* Content element */

                    var content = ctrl.createText({
                        placeholder : true,
                        model       : scope.banner.text,
                        title       : 'text',
                        onClick     : onClickHandler
                    });
                    // grouping place & text
                    ctrl.addToGroup([content.placeholder, content.text], 'group-image-' + tpl);
                    // transform text
                    var gSetText = paper.set(content.placeholder, content.text);
                    var ftText = paper.freeTransform(gSetText, options, onTransform).hideHandles();
                    // angular.extend(gSetText.freeTransform.attrs, scope.banner.text.transform);
                    // gSetText.freeTransform.attrs.translate.y = 235;
                    gSetText.freeTransform.apply();

                    scope.banner.overlay = function( isOverlay ){
                        var dimension, content = null;
                        if( isOverlay ){
                            dimension = 380;
                            content   = 0;
                        } else {
                            var h     = scope.banner.text.attrs[0].h;
                            dimension = scope.banner.dimension[0].attrs.h +  h + 20;
                            content   = h + 20;
                        }

                        scope.banner.dimension[0].attrs.h = dimension;
                        gSetText.freeTransform.attrs.translate.y = content;
                        scope.$apply(); gSetText.freeTransform.apply();
                    };

                    /* Prizes element */

                    var ftPrizeHeader, ftPrizeImage = null;
                    switch (tpl) {
                        case '1':
                            // header
                            var prize = ctrl.createText({
                                placeholder: true,
                                model: scope.banner.prize[1].header,
                                title: 'prize[1].header',
                                className: 'foreign-object-prize-1',
                                onClick: onClickHandler
                            });
                            // grouping
                            var gPrizeHeader = paper.group();
                            gPrizeHeader.node.id = 'group-prize-header-' + tpl;
                            gPrizeHeader.push(prize.placeholder).push(prize.text);
                            // set transform elements
                            options.configSize = 'small';
                            var gSetPrizeHeader = paper.set(prize.placeholder, prize.text);
                            ftPrizeHeader = paper.freeTransform(gSetPrizeHeader, options, onTransform).hideHandles();
                            angular.extend(gSetPrizeHeader.freeTransform.attrs, scope.banner.prize[1].header.transform);
                            gSetPrizeHeader.freeTransform.apply();

                            var gSetPrizeImage = paper.set();
                            angular.forEach([0], function(value, index) {
                                // image
                                var prizeImage = ctrl.createImage({
                                    placeholder: true,
                                    value: '{{ banner.prize[1].image.data[' + index + '].src }}',
                                    model: scope.banner.prize[1].image,
                                    id: 'prize',
                                    distance: {
                                        x: value
                                    },
                                    onClick: onClickHandler
                                });
                                // prize description
                                var prizeImageDescription = ctrl.createText({
                                    placeholder: true,
                                    model: scope.banner.prize[1].image,
                                    title: 'prize[1].image',
                                    className: 'foreign-object-prize-1 prize-figure',
                                    value: 'banner.prize[1].image.data[' + index + '].text',
                                    height: 50,
                                    distance: {
                                        x: value
                                    },
                                    onClick: onClickHandler
                                });
                                var prizeImageDescriptionPlaceholder = prizeImageDescription.placeholder;
                                var prizeDescriptionHtml = prizeImageDescription.text;
                                // grouping
                                ctrl.addToGroup([
                                    prizeImage.placeholder,
                                    prizeImage.image,
                                    prizeImageDescription.placeholder,
                                    prizeImageDescription.text,
                                ], 'group-prize-image-' + (index + 1) + '-' + tpl);
                                // set transform elements
                                gSetPrizeImage
                                    .push(prizeImage.placeholder)
                                    .push(prizeImage.image)
                                    .push(prizeImageDescription.placeholder)
                                    .push(prizeImageDescription.text);
                            });
                            // transform
                            options.configSize = 'medium';
                            ftPrizeImage = paper.freeTransform(gSetPrizeImage, options, onTransform).hideHandles();
                            angular.extend(gSetPrizeImage.freeTransform.attrs, scope.banner.prize[1].image.transform);
                            gSetPrizeImage.freeTransform.apply();
                            break;

                        case '2':
                            // header
                            var prize = ctrl.createText({
                                placeholder: true,
                                model: scope.banner.prize[2].header,
                                title: 'prize[2].header',
                                className: 'foreign-object-prize-2',
                                onClick: onClickHandler
                            });
                            // set transform elements
                            options.configSize = 'small';
                            var gSetPrizeHeader = paper.set(prize.placeholder, prize.text);
                            ftPrizeHeader = paper.freeTransform(gSetPrizeHeader, options, onTransform).hideHandles();
                            angular.extend(gSetPrizeHeader.freeTransform.attrs, scope.banner.prize[2].header.transform);
                            gSetPrizeHeader.freeTransform.apply();

                            var gSetPrizeImage = paper.set();
                            angular.forEach([0, 10], function(value, index) {
                                // image
                                var prizeImage = ctrl.createImage({
                                    placeholder: true,
                                    value: '{{ banner.prize[2].image.data[' + index + '].src }}',
                                    model: scope.banner.prize[2].image,
                                    id: 'prize',
                                    margin: value,
                                    onClick: onClickHandler
                                });
                                // prize description
                                var prizeImageDescription = ctrl.createText({
                                    placeholder: true,
                                    model: scope.banner.prize[2].image,
                                    title: 'prize[2].image',
                                    className: 'foreign-object-prize-2 prize-figure',
                                    value: 'banner.prize[2].image.data[' + index + '].text',
                                    height: 30,
                                    margin: value,
                                    onClick: onClickHandler
                                });
                                // grouping
                                ctrl.addToGroup([
                                    prizeImage.placeholder,
                                    prizeImage.image,
                                    prizeImageDescription.placeholder,
                                    prizeImageDescription.text,
                                ], 'group-prize-image-' + (index + 1) + '-' + tpl);
                                // set transform elements
                                gSetPrizeImage.push(prizeImage.placeholder)
                                    .push(prizeImage.image)
                                    .push(prizeImageDescription.placeholder)
                                    .push(prizeImageDescription.text);
                            });
                            // set transform elements
                            options.configSize = 'medium';
                            ftPrizeImage = paper.freeTransform(gSetPrizeImage, options, onTransform).hideHandles();
                            angular.extend(gSetPrizeImage.freeTransform.attrs, scope.banner.prize[2].image.transform);
                            gSetPrizeImage.freeTransform.apply();
                            break;

                        case '3':
                            // header
                            var prize = ctrl.createText({
                                placeholder: true,
                                model: scope.banner.prize[3].header,
                                title: 'prize[3].header',
                                className: 'foreign-object-prize-3',
                                onClick: onClickHandler
                            });
                            // set transform elements
                            options.configSize = 'small';
                            var gSetPrizeHeader = paper.set(prize.placeholder, prize.text);
                            ftPrizeHeader = paper.freeTransform(gSetPrizeHeader, options, onTransform).hideHandles();
                            angular.extend(gSetPrizeHeader.freeTransform.attrs, scope.banner.prize[3].header.transform);
                            gSetPrizeHeader.freeTransform.apply();

                            var gSetPrizeImage = paper.set();
                            angular.forEach([0, 265, 530], function(value, index) {
                                // image
                                var prizeImage = ctrl.createImage({
                                    placeholder: true,
                                    value: '{{ banner.prize[3].image.data[' + index + '].src }}',
                                    model: scope.banner.prize[3].image,
                                    id: 'prize',
                                    distance: {
                                        x: value + 5
                                    },
                                    onClick: onClickHandler
                                });
                                // prize description
                                var prizeImageDescription = ctrl.createText({
                                    placeholder: true,
                                    model: scope.banner.prize[3].image,
                                    title: 'prize[3].image',
                                    className: 'foreign-object-prize-3 prize-figure',
                                    value: 'banner.prize[3].image.data[' + index + '].text',
                                    height: 67,
                                    distance: {
                                        x: value + 5
                                    },
                                    onClick: onClickHandler
                                });
                                // grouping
                                ctrl.addToGroup([
                                    prizeImage.placeholder,
                                    prizeImage.image,
                                    prizeImageDescription.placeholder,
                                    prizeImageDescription.text,
                                ], 'group-prize-image-' + (index + 1) + '-' + tpl);
                                // set transform elements
                                gSetPrizeImage.push(prizeImage.placeholder)
                                    .push(prizeImage.image)
                                    .push(prizeImageDescription.placeholder)
                                    .push(prizeImageDescription.text);
                            });
                            // set transform elements
                            options.configSize = 'medium';
                            ftPrizeImage = paper.freeTransform(gSetPrizeImage, options, onTransform).hideHandles();
                            angular.extend(gSetPrizeImage.freeTransform.attrs, scope.banner.prize[3].image.transform);
                            gSetPrizeImage.freeTransform.apply();
                            break;
                    }

                    /* Callback */

                    // raphael element
                    function onClickHandler(e) {
                        var el = e.target,
                            id = el.id;
                        var selected, popoverTitle, popoverEl = null;

                        if (id) {

                            console.log('onClickHandler:hasID', id);

                            if (/fb/.test(id)) {
                                selected = 'fb';
                            } else if (/logo/.test(id)) {
                                selected = 'logo';
                            } else if (/prize/.test(id)) {
                                selected = 'prize-image';
                            }

                        } else if (el instanceof HTMLElement) {
                            var parentElement = el.parentNode;
                            var bodyClass = parentElement.className;

                            if (/prize/.test(bodyClass)) {
                                if (/prize-figure/.test(bodyClass)) {
                                    popoverTitle = 'Prize Image';
                                    popoverEl = '#group-prize-image-' + tpl;
                                    selected = 'prize-image';
                                } else {
                                    popoverTitle = 'Prize Header';
                                    popoverEl = '#group-prize-header-' + tpl;
                                    selected = 'prize-header';
                                }
                            } else {
                                selected = 'text';
                                popoverTitle = 'Content';
                                popoverEl = '#group-text-' + tpl;
                            };

                            if (scope.banner.selectedEl != selected && !scope.banner.onEdit) {
                                // $("body").animate({
                                //     scrollTop: $('#' + ID).offset().top - 60
                                // }, "slow");
                                // scope.banner.onEdit = true;
                                // slidePush.pushById('menu-top');
                            }
                        }

                        // set banner selected
                        scope.banner.selectedEl = selected;
                        // applying scope
                        scope.$apply();

                        /* Popover */

                        if (popoverEl) {
                            var model = null;

                            if (selected == 'text') {
                                model = scope.banner.text;
                            } else {
                                var type = /header/.test(selected) ? 'header' : 'image';
                                model = scope.banner.prize[tpl][type];
                            }

                            $rootScope.menus.top.model = model;
                            $rootScope.$apply();
                        }

                        // hide transform
                        angular.forEach(fts, function(ft) {
                            if (ft) ft.hideHandles();
                        });

                        if (selected) {
                            // show transform for selected element
                            elFts[selected].showHandles();
                        } else {
                            // scope.banner.draw = null;
                            if (scope.banner.onEdit) {
                                slidePush.pushForceCloseById('menu-top');
                                $("body").animate({
                                    scrollTop: 0
                                }, "slow");
                                scope.banner.onEdit = false;
                            }
                        }
                    };
                    // raphael free transform
                    function onTransform(ft, events) {
                        if (/end/.test(events.toString())) {
                            var id = ft.items[0].el.node.id;
                            // console.info(id);
                            // console.log(JSON.stringify(ft.attrs));

                            if (/text/.test(id)) {
                                scope.banner.text.transform = ft.attrs;
                            } else if (/logo/.test(id)) {
                                scope.banner.logo.transform = ft.attrs;
                            } else if (/fb/.test(id)) {
                                scope.banner.fb.transform = ft.attrs;
                            }
                            scope.$apply();
                        }
                    };
                    // add config click handler for raphael free transform
                    function onClickHandlerConfigTransform() {
                        if (!scope.banner.onEdit) {
                            $("body").animate({
                                scrollTop: $('#' + ID).offset().top - 60
                            }, "slow");
                            scope.banner.onEdit = true;
                            slidePush.pushById('menu-top');
                        }
                    };

                    var fts = [ftFb, ftLogo, ftText, ftPrizeHeader, ftPrizeImage];
                    var elFts = {
                        'fb': ftFb,
                        'logo': ftLogo,
                        'text': ftText,
                        'prize-header': ftPrizeHeader,
                        'prize-image': ftPrizeImage
                    };

                    // compile scope to svg
                    $compile(paper.canvas)(scope);

                }
            };
        });
});