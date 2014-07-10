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
                        this.tpl = tpl;
                        this.className = className;

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

                        this.createImage = function( params ) {
                            // placeholder
                            if( params.placeholder ){
                                var attrs = (params.attrs) ? params.attrs : { fill: 'white' };
                                var placeholder = paper.rect(
                                    params.model.attrs.x - 5,
                                    params.model.attrs.y - 5,
                                    params.model.attrs.w + 10,
                                    params.model.attrs.h + 10
                                ).attr(attrs).shadow(0, 1, 4, 0.6);
                                // if( params.onClick ){
                                //     placeholder.click(params.onClick);
                                // }

                                placeholder.node.id = params.id + '-placeholder-' + tpl;
                            }
                            // image
                            var image = paper.image(
                                params.value,
                                params.model.attrs.x, params.model.attrs.y, // x,y
                                params.model.attrs.w, params.model.attrs.h // width, height
                            );
                            image.node.id = params.id + '-image-' + tpl;
                            if( params.onClick ){
                                image.click(params.onClick);
                            }

                            return image;
                        };
                        this.createText = function( params ) {
                            // placeholder
                            var placeholder = null;
                            if( params.placeholder ){
                                placeholder = paper.rect(
                                    params.model.attrs.x,
                                    ( /image/.test(params.title) ) ? params.model.placeholder.y : params.model.attrs.y,
                                    params.model.attrs.w,
                                    params.height ? params.height : params.model.attrs.h
                                );
                                if( params.onClick ){
                                    placeholder.click(params.onClick);
                                }

                                angular.element(placeholder.node).attr({
                                    'opacity'       : '{{ banner.'+ params.title +'.placeholder.hide ? 0 : 1 }}',
                                    'fill'          : '{{ banner.'+ params.title +'.placeholder.fill }}',
                                    'fill-opacity'  : '{{ banner.'+ params.title +'.placeholder.opacity }}',
                                    'stroke'        : '{{ banner.'+ params.title +'.placeholder.nostroke ? \'none\' : banner.'+ params.title +'.placeholder.strokeColor }}',
                                    'stroke-width'  : '{{ banner.'+ params.title +'.placeholder.strokeWidth }}'
                                });
                            }
                            // html

                            // text html
                            if( /image/.test(params.title) ) {
                                var html = '<p ng-bind-html="'+ params.value +'" style="font-family:{{banner.'+ params.title +'.font.family}}; color:{{banner.'+ params.title +'.font.color}}; font-size: {{banner.'+ params.title +'.font.description.size}}px; line-height: {{banner.'+ params.title +'.font.description.line}}px"></p>'
                            } else {
                                var html = '<h2 ng-bind-html="banner.'+ params.title +'.content.title|comaToNewLine" style="font-family: {{banner.'+ params.title +'.font.family}}; font-size: {{banner.'+ params.title +'.font.header.size}}px; line-height: {{banner.'+ params.title +'.font.header.line}}px; color: {{banner.'+ params.title +'.font.color}}"></h2>';
                                if( params.title == 'text' ){
                                    html += '<p ng-bind-html="banner.'+ params.title +'.content.description" style="font-family: {{banner.'+ params.title +'.font.family}}; font-size: {{banner.'+ params.title +'.font.description.size}}px; line-height: {{banner.'+ params.title +'.font.description.line}}px; color: {{banner.'+ params.title +'.font.color}}"></p>';
                                } else {
                                    html += '<span ng-bind-html="banner.'+ params.title +'.content.description" style="font-family: {{banner.'+ params.title +'.font.family}}; font-size: {{banner.'+ params.title +'.font.description.size}}px; line-height: {{banner.'+ params.title +'.font.description.line}}px; color: {{banner.'+ params.title +'.font.color}}"></span>';
                                }
                            }

                            var text = paper.foreignObject(
                                html,
                                params.model.attrs.x,
                                ( /image/.test(params.title) ) ? params.model.placeholder.y : params.model.attrs.y,
                                params.model.attrs.w,
                                params.height ? params.height : params.model.attrs.h,
                                ( params.className ) ? params.className : className
                            );
                            if( params.onClick ){
                                text.click(params.onClick);
                            }

                            return {
                                placeholder: placeholder,
                                text: text
                            }
                        };
                    }
                ],
                link: function(scope, element, attrs, ctrl) {
                    // console.log('bannerCreator:model', scope.banner);
                    // console.log('bannerCreator:attrs', attrs);
                    // console.log('bannerCreator:element', element[0]);

                    var paper = ctrl.paper,
                        tpl   = ctrl.tpl,
                        className = ctrl.className;

                    /* Background */

                    var background = ctrl.createImage({
                        placeholder: false,
                        id: 'background',
                        value  : '{{ banner.background.image }}',
                        model  : scope.banner.background,
                        onClick: onClickHandler
                    });

                    /* fb */

                    var fb = ctrl.createImage({
                        placeholder: false,
                        id: 'fb',
                        value  : '{{ banner.fb.image }}',
                        model  : scope.banner.fb,
                        onClick: onClickHandler
                    });

                    // grouping background & fb
                    var gBg = paper.group();
                    gBg.push(background).push(fb);
                    gBg.node.id = 'group-background-' + tpl;

                    /* Logo */

                    var logo = ctrl.createImage({
                        placeholder: true,
                        id: 'logo',
                        value  : '{{ banner.logo.image }}',
                        model  : scope.banner.logo,
                        onClick: onClickHandler
                    });

                    /* Text */

                    var textElement = ctrl.createText({
                        placeholder: true,
                        model: scope.banner.text,
                        title: 'text',
                        onClick: onClickHandler
                    });
                    var placeText = textElement.placeholder;
                    var textHtml  = textElement.text;

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
                    var gSetLogo = paper.set(logo);
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

                            // transform configuration
                            var options = angular.copy(defaultOptions);
                            options.configOnClick = onClickHandlerConfigTransform;
                            options.configSize = 'small';
                            
                            var prize1 = ctrl.createText({
                                placeholder: true,
                                model: scope.banner.prize[1].header,
                                title: 'prize[1].header',
                                className: 'foreign-object-prize-1',
                                onClick: onClickHandler
                            });
                            var prizeHeaderPlaceholder = prize1.placeholder;
                            var prizeHeaderHtml = prize1.text;
                            // grouping
                            var gPrizeHeader = paper.group();
                            gPrizeHeader.push(prizeHeaderPlaceholder).push(prizeHeaderHtml);
                            gPrizeHeader.node.id = 'group-prize-header-' + tpl;
                            // set transform elements
                            var gSetPrizeHeader = paper.set(prizeHeaderPlaceholder, prizeHeaderHtml);
                            ftPrizeHeader = paper.freeTransform(gSetPrizeHeader, options, onTransform).hideHandles();
                            angular.extend(gSetPrizeHeader.freeTransform.attrs, scope.banner.prize[1].header.transform);
                            gSetPrizeHeader.freeTransform.apply();

                            // prize image
                            var prizeImage = ctrl.createImage({
                                placeholder: true,
                                value  : '{{ banner.prize[1].image.data[0].src }}',
                                model  : scope.banner.prize[1].image,
                                id     : 'prize',
                                onClick: onClickHandler
                            });
                            // prize description
                            var prizeDesc1 = ctrl.createText({
                                placeholder: true,
                                model  : scope.banner.prize[1].image,
                                title  : 'prize[1].image',
                                className: 'foreign-object-prize-1 prize-figure',
                                height : 50,
                                value  : 'banner.prize[1].image.data[0].text',
                                onClick: onClickHandler
                            });
                            var prizeImageDescriptionPlaceholder = prizeDesc1.placeholder;
                            var prizeDescriptionHtml = prizeDesc1.text;                         
                            // grouping
                            var gPrizeImage = paper.group();
                            gPrizeImage
                                .push(prizeImage).push(prizeImageDescriptionPlaceholder)
                                .push(prizeDescriptionHtml);
                            gPrizeImage.node.id = 'group-prize-image-' + tpl;
                            // set transform elements
                            var gSetPrizeImage = paper.set(prizeImage, prizeImageDescriptionPlaceholder, prizeDescriptionHtml);
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