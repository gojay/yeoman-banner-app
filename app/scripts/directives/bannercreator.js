define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.directives.Bannercreator', [])
        .directive('bannerCreator', function($rootScope, $compile, $timeout, slidePush) {
            return {
                template: '<div></div>',
                restrict: 'E',
                scope: {
                    banner: '=ngModel'
                },
                replace: true,
                /*
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
                        $timeout(function() {
                            $rootScope.menus.top = {
                                model: scope.banner.text,
                                template: '<div ng-include src="\'views/banner-top-config.html\'"></div>'
                            };
                        }, 1000);

                        var ID = attrs.id;
                        var tpl = attrs.tpl || 0,
                            svgHeight = null,
                            className = 'foreign-object-' + tpl;

                        switch (tpl) {
                            case '2':
                                svgHeight = 339;
                                var wH = {
                                    w: 332,
                                    h: 200
                                };
                                scope.banner.background.image = "http://placehold.it/810x339";
                                angular.extend(scope.banner.text.attrs, wH);
                                angular.extend(scope.banner.text.attrs, wH);
                                break;
                            default:
                                svgHeight = 380;
                                break;
                        };

                        var paper = this.paper = Raphael(ID, 810, svgHeight);

                        this.createImage = function( params ) {
                            // placeholder

                            // image
                        };
                        this.createText = function( params ) {
                            // placeholder

                            // html
                        };
                    }
                ],
                */
                link: function(scope, element, attrs, ctrl) {
                    // console.log('bannerCreator:model', scope.banner);
                    // console.log('bannerCreator:attrs', attrs);
                    // console.log('bannerCreator:element', element[0]);
                    var ID = attrs.id,
                        className = attrs.class;
                    var tpl = attrs.tpl || 0,
                        svgHeight = null,
                        className = 'foreign-object-' + tpl;

                    element.attr('id', ID).addClass(className);
                    scope.tpl = tpl;

                    $timeout(function() {
                        var model = angular.copy(scope.banner.text);
                        model.section = 'Content';
                        $rootScope.menus.top = {
                            model: scope.banner.text,
                            template: '<div ng-include src="\'views/banner-top-config.html\'"></div>'
                        };
                    }, 1000);

                    // scope.$watch('banner.draw', function(value) {
                    //     if (!elFts[scope.banner.selected]) return;
                    //     elFts[scope.banner.selected].setOpts({
                    //         draw: [value == 'bbox' ? 'bbox' : null, value == 'circle' ? 'circle' : null]
                    //     });
                    // });
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

                    switch (tpl) {
                        case '2':
                            svgHeight = 339;
                            var wH = {
                                w: 332,
                                h: 200
                            };
                            scope.banner.background.image = "http://placehold.it/810x339";
                            angular.extend(scope.banner.text.attrs, wH);
                            angular.extend(scope.banner.text.attrs, wH);
                            break;
                        default:
                            svgHeight = 380;
                            break;
                    };

                    var paper = Raphael(ID, 810, svgHeight);

                    // add definition styles for foreignObject HTML
                    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
                    var css = {
                        0: "svg{background-color:#FFF}body{background-color:transparent}.foreign-object-0 h2{text-align:left;margin:0;padding:10px 20px;border-bottom:none}.foreign-object-0 h2~p{text-align:left;margin:0;padding:0 20px}",
                        1: "svg{background-color:#FFF}body{background-color:transparent}.foreign-object-1 h2{text-align:left;margin:0;padding:10px 20px;border-bottom:none}.foreign-object-1 h2~p{text-align:left;padding:0 20px}.foreign-object-prize-1 h2{margin:0;padding:3px 5px 0;text-align:center;border-bottom:none}.foreign-object-prize-1 span{display:block;text-align:center}.foreign-object-prize-1 p{width:340px;height:50px;padding:0 15px;text-align:center;vertical-align:middle;display:table-cell}.prize-black-text{color:#333!important}",
                        2: "svg{background-color:#FFF}body{background-color:transparent}.foreign-object-2 h2{text-align:left;margin:0;padding:10px 20px;border-bottom:none}.foreign-object-2 h2~p{text-align:left;padding:0 20px;top:10px}.foreign-object-prize-2 h2{margin:0;padding:3px 5px 0;text-align:center;border-bottom:none}.foreign-object-prize-2 span{display:block;text-align:center}.foreign-object-prize-2 p{width:203px;height:30px;padding:0 10px;text-align:center;vertical-align:middle;display:table-cell}.prize-black-text{color:#333!important}"
                    };

                    var _css = css[tpl];
                    var style = document.createElement('style');
                    style.type = 'text/css';
                    style.styleSheet ? style.styleSheet.cssText = _css : style.appendChild(document.createTextNode(_css));
                    defs.appendChild(style);
                    paper.canvas.insertBefore(defs, paper.defs);

                    /* Background */

                    // bg image
                    var background = paper.image(
                        '{{ banner.background.image }}',
                        scope.banner.background.attrs.x, scope.banner.background.attrs.y, // x,y
                        scope.banner.background.attrs.w, scope.banner.background.attrs.h // width, height
                    ).click(onClickHandler);
                    // facebook
                    var fb = paper.image(
                        '{{ banner.fb.image }}',
                        scope.banner.fb.attrs.x, scope.banner.fb.attrs.y,
                        scope.banner.fb.attrs.w, scope.banner.fb.attrs.h
                    ).click(onClickHandler);
                    fb.node.id = 'fb-' + tpl;
                    // grouping background & fb
                    var gBg = paper.group();
                    gBg.push(background).push(fb);
                    gBg.node.id = 'group-background-' + tpl;

                    /* Logo */

                    // logo placeholder
                    var placeholder = paper.rect(
                        scope.banner.logo.attrs.x - 5,
                        scope.banner.logo.attrs.y - 5,
                        scope.banner.logo.attrs.w + 10,
                        scope.banner.logo.attrs.h + 10
                    ).attr({
                        fill: 'white'
                    }).shadow(0, 1, 4, 0.6).click(onClickHandler);
                    placeholder.node.id = 'logo-placeholder-' + tpl;
                    // logo image
                    var logo = paper.image(
                        '{{ banner.logo.image }}',
                        scope.banner.logo.attrs.x, scope.banner.logo.attrs.y,
                        scope.banner.logo.attrs.w, scope.banner.logo.attrs.h
                    ).click(onClickHandler);
                    logo.node.id = 'logo-image-' + tpl;

                    // grouping logo placeholder & image
                    var gLogo = paper.group();
                    gLogo.push(placeholder).push(logo);
                    gLogo.node.id = 'group-logo-' + tpl;

                    /* Text */

                    // text placeholder
                    var placeText = paper.rect(
                        scope.banner.text.attrs.x,
                        scope.banner.text.attrs.y,
                        scope.banner.text.attrs.w,
                        scope.banner.text.attrs.h
                    ).click(onClickHandler);

                    angular.element(placeText.node).attr({
                        'opacity': '{{ banner.text.placeholder.hide ? 0 : 1 }}',
                        'fill': '{{ banner.text.placeholder.fill }}',
                        'fill-opacity': '{{ banner.text.placeholder.opacity }}',
                        'stroke': '{{ banner.text.placeholder.nostroke ? \'none\' : banner.text.placeholder.strokeColor }}',
                        'stroke-width': '{{ banner.text.placeholder.strokeWidth }}'
                    });

                    // text html
                    var textHtml = paper.foreignObject('<h2 ng-bind-html="banner.text.content.title|comaToNewLine" style="font-family: {{banner.text.font.family}}; font-size: {{banner.text.font.header.size}}px; line-height: {{banner.text.font.header.line}}px; color: {{banner.text.font.color}}"></h2><p ng-bind-html="banner.text.content.description" style="font-family: {{banner.text.font.family}}; font-size: {{banner.text.font.description.size}}px; line-height: {{banner.text.font.description.line}}px; color: {{banner.text.font.color}}"></p>',
                        scope.banner.text.attrs.x,
                        scope.banner.text.attrs.y,
                        scope.banner.text.attrs.w,
                        scope.banner.text.attrs.h,
                        className
                    );
                    textHtml.node.id = 'text-html-' + tpl;
                    textHtml.click(onClickHandler);
                    // grouping place & text
                    var gText = paper.group();
                    gText.push(placeText).push(textHtml);
                    gText.node.id = 'group-text-' + tpl;

                    /* Transform */

                    var defaultOptions = {
                        keepRatio: ['axisX', 'axisY', 'bboxCorners', 'bboxSides']
                    };

                    // Transform fb
                    var ftFb = paper.freeTransform(fb, defaultOptions, onTransform).hideHandles();
                    angular.extend(fb.freeTransform.attrs, scope.banner.fb.transform);
                    fb.freeTransform.apply();

                    // Transform logo
                    var gSetLogo = paper.set(placeholder, logo);
                    var ftLogo = paper.freeTransform(gSetLogo, defaultOptions, onTransform).hideHandles();
                    angular.extend(gSetLogo.freeTransform.attrs, scope.banner.logo.transform);
                    gSetLogo.freeTransform.apply();

                    // Transform text
                    var options = angular.copy(defaultOptions);
                    options.configOnClick = onClickHandlerConfigTransform;
                    var gSetText = paper.set(placeText, textHtml);
                    var ftText = paper.freeTransform(gSetText, options, onTransform).hideHandles();
                    angular.extend(gSetText.freeTransform.attrs, scope.banner.text.transform);
                    gSetText.freeTransform.apply();

                    /* Prize */

                    var ftPrizeHeader, ftPrizeImage = null;
                    switch (tpl) {
                        case '1':
                            // prize header
                            var prizeHeaderPlaceholder = paper.rect(
                                scope.banner.prize[1].header.attrs.x,
                                scope.banner.prize[1].header.attrs.y,
                                scope.banner.prize[1].header.attrs.w,
                                scope.banner.prize[1].header.attrs.h
                            ).click(onClickHandler);
                            angular.element(prizeHeaderPlaceholder.node).attr({
                                'opacity': '{{banner.prize[1].header.placeholder.hide ? 0 : 1 }}',
                                'fill': '{{banner.prize[1].header.placeholder.fill}}',
                                'fill-opacity': '{{banner.prize[1].header.placeholder.opacity}}',
                                'stroke': '{{banner.prize[1].header.placeholder.nostroke ? \'none\' : banner.prize[1].header.placeholder.strokeColor }}',
                                'stroke-width': '{{banner.prize[1].header.placeholder.strokeWidth}}'
                            });
                            prizeHeaderPlaceholder.node.id = 'prize-header-placeholder-' + tpl;
                            var prizeHeaderHtml = paper.foreignObject(
                                '<h2 ng-bind-html="banner.prize[1].header.content.title" style="font-family:{{banner.prize[1].header.font.family}}; color:{{banner.prize[1].header.font.color}}; font-size: {{banner.prize[1].header.font.header.size}}px; line-height: {{banner.prize[1].header.font.header.line}}px"></h2><span ng-bind-html="banner.prize[1].header.content.description" style="font-family:{{banner.prize[1].header.font.family}}; color:{{banner.prize[1].header.font.color}}; font-size: {{banner.prize[1].header.font.description.size}}px; line-height: {{banner.prize[1].header.font.description.line}}px"></span>',
                                scope.banner.prize[1].header.attrs.x,
                                scope.banner.prize[1].header.attrs.y,
                                scope.banner.prize[1].header.attrs.w,
                                scope.banner.prize[1].header.attrs.h,
                                'foreign-object-prize-1'
                            ).click(onClickHandler);
                            prizeHeaderHtml.node.id = 'prize-header-text-' + tpl;
                            // grouping
                            var gPrizeHeader = paper.group();
                            gPrizeHeader.push(prizeHeaderPlaceholder).push(prizeHeaderHtml);
                            gPrizeHeader.node.id = 'group-prize-header-' + tpl;

                            // transform configuration
                            var options = angular.copy(defaultOptions);
                            options.configOnClick = onClickHandlerConfigTransform;
                            options.configSize = 'small';
                            // set transform elements
                            var gSetPrizeHeader = paper.set(prizeHeaderPlaceholder, prizeHeaderHtml);
                            ftPrizeHeader = paper.freeTransform(gSetPrizeHeader, options, onTransform).hideHandles();
                            angular.extend(gSetPrizeHeader.freeTransform.attrs, scope.banner.prize[1].header.transform);
                            gSetPrizeHeader.freeTransform.apply();

                            // prize image
                            var prizeImagePlaceholder = paper.rect(
                                scope.banner.prize[1].image.attrs.x - 5,
                                scope.banner.prize[1].image.attrs.y - 5,
                                scope.banner.prize[1].image.attrs.w + 10,
                                scope.banner.prize[1].image.attrs.h + 10
                            ).attr({
                                'fill': 'white',
                                'stroke': 'black',
                                'stroke-width': 1,
                                'stroke-opacity': 0.3
                            }).click(onClickHandler);
                            prizeImagePlaceholder.node.id = 'prize-image-placeholder-' + tpl;

                            var prizeImage = paper.image(
                                '{{ banner.prize[1].image.data[0].src }}',
                                scope.banner.prize[1].image.attrs.x,
                                scope.banner.prize[1].image.attrs.y,
                                scope.banner.prize[1].image.attrs.w,
                                scope.banner.prize[1].image.attrs.h
                            ).click(onClickHandler);
                            prizeImage.node.id = 'prize-image-src-' + tpl;
                            // prize description
                            var prizeImageDescriptionPlaceholder = paper.rect(
                                scope.banner.prize[1].image.attrs.x,
                                scope.banner.prize[1].image.placeholder.y,
                                scope.banner.prize[1].image.attrs.w,
                                50
                            ).click(onClickHandler);
                            angular.element(prizeImageDescriptionPlaceholder.node).attr({
                                'y': '{{ banner.prize[1].image.placeholder.y }}',
                                'opacity': '{{banner.prize[1].image.placeholder.hide ? 0 : 1 }}',
                                'fill': '{{banner.prize[1].image.placeholder.fill}}',
                                'fill-opacity': '{{banner.prize[1].image.placeholder.opacity}}',
                                'stroke': '{{banner.prize[1].image.placeholder.nostroke ? \'none\' : banner.prize[1].image.placeholder.strokeColor }}',
                                'stroke-width': '{{banner.prize[1].image.placeholder.strokeWidth}}'
                            });
                            prizeImageDescriptionPlaceholder.node.id = 'prize-image-description-placeholder-' + tpl;
                            var prizeDescriptionHtml = paper.foreignObject(
                                '<p ng-bind-html="banner.prize[1].image.data[0].text" style="font-family: {{banner.prize[1].image.font.family}}; color:{{banner.prize[1].image.font.color}}; font-size: {{banner.prize[1].image.font.description.size}}px; line-height: {{banner.prize[1].image.font.description.line}}px"></p>',
                                scope.banner.prize[1].image.attrs.x,
                                scope.banner.prize[1].image.placeholder.y,
                                scope.banner.prize[1].image.attrs.w,
                                50,
                                'foreign-object-prize-1 prize-figure'
                            ).click(onClickHandler);
                            angular.element(prizeDescriptionHtml.node).attr({
                                'y': '{{ banner.prize[1].image.placeholder.y }}'
                            });
                            prizeDescriptionHtml.node.id = 'prize-image-descrition-text' + tpl;
                            // grouping
                            var gPrizeImage = paper.group();
                            gPrizeImage
                                .push(prizeImagePlaceholder)
                                .push(prizeImage).push(prizeImageDescriptionPlaceholder)
                                .push(prizeDescriptionHtml);
                            gPrizeImage.node.id = 'group-prize-image-' + tpl;

                            // transform configuration
                            var options = angular.copy(defaultOptions);
                            options.configOnClick = onClickHandlerConfigTransform;
                            options.configSize = 'small';
                            // set transform elements
                            var gSetPrizeImage = paper.set(prizeImagePlaceholder, prizeImage, prizeImageDescriptionPlaceholder, prizeDescriptionHtml);
                            ftPrizeImage = paper.freeTransform(gSetPrizeImage, options, onTransform).hideHandles();
                            angular.extend(gSetPrizeImage.freeTransform.attrs, scope.banner.prize[1].image.transform);
                            gSetPrizeImage.freeTransform.apply();
                            break;

                        case '2':
                            // prize header
                            var prizeHeaderPlaceholder = paper.rect(
                                scope.banner.prize[2].header.attrs.x,
                                scope.banner.prize[2].header.attrs.y,
                                scope.banner.prize[2].header.attrs.w,
                                50
                            ).click(onClickHandler);
                            angular.element(prizeHeaderPlaceholder.node).attr({
                                'opacity': '{{banner.prize[2].header.placeholder.hide ? 0 : 1 }}',
                                'fill': '{{banner.prize[2].header.placeholder.fill}}',
                                'fill-opacity': '{{banner.prize[2].header.placeholder.opacity}}',
                                'stroke': '{{banner.prize[2].header.placeholder.nostroke ? \'none\' : banner.prize[2].header.placeholder.strokeColor }}',
                                'stroke-width': '{{banner.prize[2].header.placeholder.strokeWidth}}'
                            });
                            prizeHeaderPlaceholder.node.id = 'prize-header-placeholder-' + tpl;
                            var prizeHeaderHtml = paper.foreignObject(
                                '<h2 ng-bind-html="banner.prize[2].header.content.title" style="font-family:{{banner.prize[2].header.font.family}}; color:{{banner.prize[2].header.font.color}}; font-size: {{banner.prize[2].header.font.header.size}}px; line-height: {{banner.prize[2].header.font.header.line}}px"></h2><span ng-bind-html="banner.prize[2].header.content.description" style="font-family:{{banner.prize[2].header.font.family}}; color:{{banner.prize[2].header.font.color}}; font-size: {{banner.prize[2].header.font.description.size}}px; line-height: {{banner.prize[2].header.font.description.line}}px"></span>',
                                scope.banner.prize[2].header.attrs.x,
                                scope.banner.prize[2].header.attrs.y,
                                scope.banner.prize[2].header.attrs.w,
                                50,
                                'foreign-object-prize-2'
                            ).click(onClickHandler);
                            prizeHeaderHtml.node.id = 'prize-header-text-' + tpl;
                            // grouping
                            var gPrizeHeader = paper.group();
                            gPrizeHeader.push(prizeHeaderPlaceholder).push(prizeHeaderHtml);
                            gPrizeHeader.node.id = 'group-prize-header-' + tpl;

                            // transform configuration
                            var options = angular.copy(defaultOptions);
                            options.configOnClick = onClickHandlerConfigTransform;
                            options.configSize = 'small';
                            // set transform elements
                            var gSetPrizeHeader = paper.set(prizeHeaderPlaceholder, prizeHeaderHtml);
                            ftPrizeHeader = paper.freeTransform(gSetPrizeHeader, options, onTransform).hideHandles();
                            angular.extend(gSetPrizeHeader.freeTransform.attrs, scope.banner.prize[2].header.transform);
                            gSetPrizeHeader.freeTransform.apply();

                            // prize image 1
                            var prizeImagePlaceholder1 = paper.rect(
                                scope.banner.prize[2].image.attrs.x - 5,
                                scope.banner.prize[2].image.attrs.y - 5,
                                scope.banner.prize[2].image.attrs.w + 10,
                                scope.banner.prize[2].image.attrs.h + 10
                            ).attr({
                                'fill': 'white',
                                'stroke': 'black',
                                'stroke-width': 1,
                                'stroke-opacity': 0.3
                            }).click(onClickHandler);
                            prizeImagePlaceholder1.node.id = 'prize-image-placeholder-1-' + tpl;
                            var prizeImage1 = paper.image(
                                '{{ banner.prize[2].image.data[0].src }}',
                                scope.banner.prize[2].image.attrs.x,
                                scope.banner.prize[2].image.attrs.y,
                                scope.banner.prize[2].image.attrs.w,
                                scope.banner.prize[2].image.attrs.h
                            );
                            prizeImage1.node.id = 'prize-image-src-1-' + tpl;
                            // prize description 1
                            var prizeDescriptionPlaceholder1 = paper.rect(
                                scope.banner.prize[2].image.attrs.x,
                                scope.banner.prize[2].image.placeholder.y,
                                scope.banner.prize[2].image.attrs.w,
                                30
                            ).click(onClickHandler);
                            angular.element(prizeDescriptionPlaceholder1.node).attr({
                                'y': '{{ banner.prize[2].image.placeholder.y }}',
                                'opacity': '{{banner.prize[2].image.placeholder.hide ? 0 : 1 }}',
                                'fill': '{{banner.prize[2].image.placeholder.fill}}',
                                'fill-opacity': '{{banner.prize[2].image.placeholder.opacity}}',
                                'stroke': '{{banner.prize[2].image.placeholder.nostroke ? \'none\' : banner.prize[2].image.placeholder.strokeColor }}',
                                'stroke-width': '{{banner.prize[2].image.placeholder.strokeWidth}}'
                            });
                            prizeDescriptionPlaceholder1.node.id = 'prize-image-description-placeholder-1-' + tpl;
                            var prizeDescriptionHtml1 = paper.foreignObject(
                                '<p ng-bind-html="banner.prize[2].image.data[0].text" style="font-family:{{banner.prize[2].image.font.family}}; color:{{banner.prize[2].image.font.color}}; font-size: {{banner.prize[2].image.font.description.size}}px; line-height: {{banner.prize[2].image.font.description.line}}px"></p>',
                                scope.banner.prize[2].image.attrs.x,
                                scope.banner.prize[2].image.placeholder.y,
                                scope.banner.prize[2].image.attrs.w,
                                30,
                                'foreign-object-prize-2 prize-figure'
                            ).click(onClickHandler);
                            prizeDescriptionHtml1.node.id = 'prize-image-description-text-1-' + tpl;
                            angular.element(prizeDescriptionHtml1.node).attr({
                                'y': '{{ banner.prize[2].image.placeholder.y }}'
                            });

                            // prize image 2
                            var prizeImagePlaceholder2 = paper.rect(
                                scope.banner.prize[2].image.attrs.x + 216 - 5,
                                scope.banner.prize[2].image.attrs.y - 5,
                                scope.banner.prize[2].image.attrs.w + 10,
                                scope.banner.prize[2].image.attrs.h + 10
                            ).attr({
                                'fill': 'white',
                                'stroke': 'black',
                                'stroke-width': 1,
                                'stroke-opacity': 0.3
                            }).click(onClickHandler);
                            prizeImagePlaceholder2.node.id = 'prize-image-placeholder-2-' + tpl;
                            var prizeImage2 = paper.image(
                                '{{ banner.prize[2].image.data[1].src }}',
                                scope.banner.prize[2].image.attrs.x + 216,
                                scope.banner.prize[2].image.attrs.y,
                                scope.banner.prize[2].image.attrs.w,
                                scope.banner.prize[2].image.attrs.h
                            ).click(onClickHandler);
                            prizeImage2.node.id = 'prize-image-src-2-' + tpl;
                            // prize description 2
                            var prizeDescriptionPlaceholder2 = paper.rect(
                                scope.banner.prize[2].image.attrs.x + 216,
                                scope.banner.prize[2].image.placeholder.y,
                                scope.banner.prize[2].image.attrs.w,
                                30
                            ).click(onClickHandler);
                            angular.element(prizeDescriptionPlaceholder2.node).attr({
                                'y': '{{ banner.prize[2].image.placeholder.y }}',
                                'opacity': '{{banner.prize[2].image.placeholder.hide ? 0 : 1 }}',
                                'fill': '{{banner.prize[2].image.placeholder.fill}}',
                                'fill-opacity': '{{banner.prize[2].image.placeholder.opacity}}',
                                'stroke': '{{banner.prize[2].image.placeholder.nostroke ? \'none\' : banner.prize[2].image.placeholder.strokeColor }}',
                                'stroke-width': '{{banner.prize[2].image.placeholder.strokeWidth}}'
                            });
                            prizeDescriptionPlaceholder2.node.id = 'prize-image-description-placeholder-2-' + tpl;
                            var prizeDescriptionHtml2 = paper.foreignObject(
                                '<p ng-bind-html="banner.prize[2].image.data[1].text" style="font-family:{{banner.prize[2].image.font.family}}; color:{{banner.prize[2].image.font.color}}; font-size: {{banner.prize[2].image.font.description.size}}px; line-height: {{banner.prize[2].image.font.description.line}}px"></p>',
                                scope.banner.prize[2].image.attrs.x + 216,
                                scope.banner.prize[2].image.placeholder.y,
                                scope.banner.prize[2].image.attrs.w,
                                30,
                                'foreign-object-prize-2 prize-figure'
                            ).click(onClickHandler);
                            prizeDescriptionHtml2.node.id = 'prize-image-description-text-2-' + tpl;
                            angular.element(prizeDescriptionHtml2.node).attr({
                                'y': '{{ banner.prize[2].image.placeholder.y }}'
                            });
                            // grouping
                            var gPrizeImage = paper.group();
                            gPrizeImage
                                .push(prizeImagePlaceholder1)
                                .push(prizeImage1).push(prizeDescriptionPlaceholder1)
                                .push(prizeDescriptionHtml1)
                                .push(prizeImagePlaceholder2)
                                .push(prizeImage2).push(prizeDescriptionPlaceholder2)
                                .push(prizeDescriptionHtml2);
                            gPrizeImage.node.id = 'group-prize-image-' + tpl;

                            // transform configuration
                            var options = angular.copy(defaultOptions);
                            options.configOnClick = onClickHandlerConfigTransform;
                            // set transform elements
                            var gSetPrizeImage = paper.set(prizeImagePlaceholder1, prizeImage1, prizeDescriptionPlaceholder1, prizeDescriptionHtml1, prizeImagePlaceholder2, prizeImage2, prizeDescriptionPlaceholder2, prizeDescriptionHtml2);
                            ftPrizeImage = paper.freeTransform(gSetPrizeImage, options, onTransform).hideHandles();
                            angular.extend(gSetPrizeImage.freeTransform.attrs, scope.banner.prize[2].image.transform);
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

                            if (scope.banner.selected != selected && !scope.banner.onEdit) {
                                // $("body").animate({
                                //     scrollTop: $('#' + ID).offset().top - 60
                                // }, "slow");
                                // scope.banner.onEdit = true;
                                // slidePush.pushById('menu-top');
                            }
                        }

                        // set banner selected
                        scope.banner.selected = selected;
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