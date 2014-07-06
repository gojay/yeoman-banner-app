define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.directives.Bannercreator', [])
        .directive('bannerCreator', function($rootScope, $compile, $timeout, slidePush) {
            return {
                template: '<div data-snap-ignore="true"></div>',
                restrict: 'E',
                scope: {
                    banner: '=ngModel'
                },
                replace: true,
                // controller: function(scope, element, attrs, transclude) {},
                link: function(scope, element, attrs, ctrl) { // console.log('bannerCreator:model', scope.banner);
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
                            angular.extend(scope.banner.text.attrs.place, wH);
                            angular.extend(scope.banner.text.attrs.html, wH);
                            break;
                        default:
                            svgHeight = 380;
                            scope.banner.text.font.header.size = 24;
                            scope.banner.text.font.header.line = 32;
                            scope.banner.text.font.description.size = 12;
                            scope.banner.text.font.description.line = 16;
                            break;
                    };

                    var paper = Raphael(ID, 810, svgHeight);

                    // add definition styles for foreignObject HTML
                    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
                    var css = {
                        0: "svg{background-color:#FFF}body{background-color:transparent;height:235px}.foreign-object-0 h2{text-align:left;font-weight:400;font-size:27px;line-height:32px;margin:0;padding:10px 20px;border-bottom:none}.foreign-object-0 h2~p{text-align:left;font-size:13px;line-height:16px;margin:0;padding:0 20px}",
                        1: "svg{background-color:#FFF}body{background-color:transparent;height:235px}.foreign-object-1 h2{text-align:left;font-weight:400;font-size:27px;line-height:32px;margin:0;padding:10px 20px;border-bottom:none}.foreign-object-1 h2~p{text-align:left;line-height:16px;font-size:13px;padding:0 20px}.foreign-object-prize-1 h2{margin:0;padding:3px 5px 0;line-height:18px;text-align:center;font-weight:400;font-size:18px;border-bottom:none}.foreign-object-prize-1 span{display:block;text-align:center;font-size:12px;line-height:16px}.foreign-object-prize-1 p{width:340px;height:50px;padding:0 15px;font-size:13px;font-weight:normal;line-height:15px;text-align:center;vertical-align:middle;display:table-cell}.prize-black-text{color:#333!important}",
                        2: "svg{background-color:#FFF}body{background-color:transparent;height:332px}.foreign-object-2 h2{text-align:left;font-weight:400;font-size:24px;line-height:29px;margin:0;padding:10px 20px;border-bottom:none}.foreign-object-2 h2~p{text-align:left;line-height:16px;font-size:12px;padding:0 20px;top:10px}.foreign-object-prize-2 h2{margin:0;padding:3px 5px 0;text-align:center;font-weight:400;font-size:22px;line-height:24px;border-bottom:none}.foreign-object-prize-2 span{display:block;text-align:center;font-size:14px}.foreign-object-prize-2 p{width:203px;height:30px;padding:0 10px;font-size:12px;font-weight:normal;line-height:15px;text-align:center;vertical-align:middle;display:table-cell}.prize-black-text{color:#333!important}"
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

                    scope.fill = "none";

                    // text placeholder
                    var placeText = paper.rect(
                        scope.banner.text.attrs.place.x,
                        scope.banner.text.attrs.place.y,
                        scope.banner.text.attrs.place.w,
                        scope.banner.text.attrs.place.h
                    ).click(onClickHandler);

                    $(placeText.node).attr({
                        'opacity': '{{ banner.text.placeholder.hide ? 0 : 1 }}',
                        'fill': '{{ banner.text.placeholder.fill }}',
                        'fill-opacity': '{{ banner.text.placeholder.opacity }}',
                        'stroke': '{{ banner.text.placeholder.nostroke ? \'none\' : banner.text.placeholder.strokeColor }}',
                        'stroke-width': '{{ banner.text.placeholder.strokeWidth }}'
                    });
                    console.log('placeText', placeText);

                    // text html
                    var textHtml = paper.foreignObject('<h2 ng-bind-html="banner.text.html.title|comaToNewLine" style="font-family: {{banner.text.font.family}}; font-size: {{banner.text.font.header.size}}px; line-height: {{banner.text.font.header.line}}px; color: {{banner.text.font.color}}"></h2><p ng-bind-html="banner.text.html.description" style="font-family: {{banner.text.font.family}}; font-size: {{banner.text.font.description.size}}px; line-height: {{banner.text.font.description.line}}px; color: {{banner.text.font.color}}"></p>',
                        scope.banner.text.attrs.html.x,
                        scope.banner.text.attrs.html.y,
                        scope.banner.text.attrs.html.w,
                        scope.banner.text.attrs.html.h,
                        className
                    );
                    textHtml.node.id = 'text-html-' + tpl;
                    textHtml.click(onClickHandler);
                    // grouping place & text
                    var gText = paper.group();
                    gText.push(placeText).push(textHtml);
                    gText.node.id = 'group-text-' + tpl;

                    /* Prize */

                    switch (tpl) {
                        case '1':
                            // prize header
                            var prizeHeaderPlaceholder = paper.rect(
                                504, 128, // x, y
                                231, 38 // width, height
                            ).click(onClickHandler);
                            $(prizeHeaderPlaceholder.node).attr({
                                'opacity': '{{banner.prize[1].header.placeholder.hide ? 0 : 1 }}',
                                'fill': '{{banner.prize[1].header.placeholder.fill}}',
                                'fill-opacity': '{{banner.prize[1].header.placeholder.opacity}}',
                                'stroke': '{{banner.prize[1].header.placeholder.nostroke ? \'none\' : banner.prize[1].header.placeholder.strokeColor }}',
                                'stroke-width': '{{banner.prize[1].header.placeholder.strokeWidth}}'
                            });
                            prizeHeaderPlaceholder.node.id = 'prize-header-placeholder-' + tpl;
                            var prizeHeaderHtml = paper.foreignObject(
                                '<h2 ng-bind-html="banner.prize[1].header.title.text" style="font-family:{{banner.prize[1].header.font.family}}; color:{{banner.prize[1].header.font.color}}"></h2><span ng-bind-html="banner.prize[1].header.description.text" style="font-family:{{banner.prize[1].header.font.family}}; color:{{banner.prize[1].header.font.color}}"></span>',
                                504, 128,
                                231, 38,
                                'foreign-object-prize-1'
                            ).click(onClickHandler);
                            prizeHeaderHtml.node.id = 'prize-header-text-' + tpl;
                            // grouping
                            var gPrizeHeader = paper.group();
                            gPrizeHeader.push(prizeHeaderPlaceholder).push(prizeHeaderHtml);
                            gPrizeHeader.node.id = 'group-prize-header-' + tpl;

                            // prize image
                            var prizeImagePlaceholder = paper.rect(
                                450, 170, // x, y
                                350, 193 // width, height
                            ).attr({
                                'fill': 'white',
                                'stroke': 'black',
                                'stroke-width': 1,
                                'stroke-opacity': 0.3
                            }).click(onClickHandler);
                            prizeImagePlaceholder.node.id = 'prize-image-placeholder-' + tpl;
                            var prizeImage = paper.image(
                                '{{ banner.prize[1].image.src }}',
                                455, 175,
                                340, 183
                            ).click(onClickHandler);
                            prizeImage.node.id = 'prize-image-src-' + tpl;
                            // prize description
                            var prizeDescriptionPlaceholder = paper.rect(
                                455, '{{ banner.prize[1].image.y }}', // x, y
                                340, 50 // width, height
                            ).click(onClickHandler);
                            $(prizeDescriptionPlaceholder.node).attr({
                                'opacity': '{{banner.prize[1].image.placeholder.hide ? 0 : 1 }}',
                                'fill': '{{banner.prize[1].image.placeholder.fill}}',
                                'fill-opacity': '{{banner.prize[1].image.placeholder.opacity}}',
                                'stroke': '{{banner.prize[1].image.placeholder.nostroke ? \'none\' : banner.prize[1].image.placeholder.strokeColor }}',
                                'stroke-width': '{{banner.prize[1].image.placeholder.strokeWidth}}'
                            });
                            prizeDescriptionPlaceholder.node.id = 'prize-image-description-placeholder-' + tpl;
                            var prizeDescriptionHtml = paper.foreignObject(
                                '<p ng-bind-html="banner.prize[1].image.text" style="font-family: {{banner.prize[1].text.font.family}}; color:{{banner.prize[1].image.font.color}}"></p>',
                                455, '{{ banner.prize[1].image.y }}',
                                340, 50,
                                'foreign-object-prize-1 prize-figure'
                            ).click(onClickHandler);
                            prizeDescriptionHtml.node.id = 'prize-image-descrition-text' + tpl;
                            // grouping
                            var gPrizeImage = paper.group();
                            gPrizeImage
                                .push(prizeImagePlaceholder)
                                .push(prizeImage).push(prizeDescriptionPlaceholder)
                                .push(prizeDescriptionHtml);
                            gPrizeImage.node.id = 'group-prize-image-' + tpl;
                            break;

                        case '2':
                            // prize header
                            var prizeHeaderPlaceholder = paper.rect(
                                447, 129, // x, y
                                272, 50 // width, height
                            ).attr({
                                'fill': 'black',
                                'fill-opacity': 0.75
                            });
                            prizeHeaderPlaceholder.node.id = 'prize-header-placeholder-' + tpl;
                            var prizeHeaderHtml = paper.foreignObject(
                                '<h2 ng-bind-html="banner.prize[2].text.header.text" style="font-family: {{banner.prize[2].text.font.family}}"></h2><span ng-bind-html="banner.prize[2].text.description.text" style="font-family: {{banner.prize[2].text.font.family}}"></span>',
                                447, 129,
                                272, 50,
                                'foreign-object-prize-2'
                            );
                            prizeHeaderHtml.node.id = 'prize-header-text-' + tpl;
                            // grouping
                            var gPrizeHeader = paper.group();
                            gPrizeHeader.push(prizeHeaderPlaceholder).push(prizeHeaderHtml);
                            gPrizeHeader.node.id = 'group-prize-header-' + tpl;

                            // prize image 1
                            var prizeImagePlaceholder1 = paper.rect(
                                374, 189, // x, y
                                213, 140 // width, height
                            ).attr({
                                'fill': 'white',
                                'stroke': 'black',
                                'stroke-width': 1,
                                'stroke-opacity': 0.3
                            });
                            prizeImagePlaceholder1.node.id = 'prize-image-placeholder-1-' + tpl;
                            var prizeImage1 = paper.image(
                                '{{ banner.prize[2].image.attrs[0].src }}',
                                379, 194,
                                203, 130
                            );
                            prizeImage1.node.id = 'prize-image-src-1-' + tpl;
                            // prize description 1
                            var prizeDescriptionPlaceholder1 = paper.rect(
                                379, '{{ banner.prize[2].image.y }}', // x, y
                                203, 30 // width, height
                            ).attr({
                                'fill': 'black',
                                'fill-opacity': 0.75,
                                'stroke': 'none'
                            });
                            prizeDescriptionPlaceholder1.node.id = 'prize-image-description-placeholder-1-' + tpl;
                            var prizeDescriptionHtml1 = paper.foreignObject(
                                '<p ng-bind-html="banner.prize[2].image.attrs[0].text" style="font-family: {{banner.prize[2].text.font.family}}"></p>',
                                379, '{{ banner.prize[2].image.y }}',
                                203, 30,
                                'foreign-object-prize-2 prize-figure'
                            );
                            prizeDescriptionHtml1.node.id = 'prize-image-description-text-1-' + tpl;

                            // prize image 2
                            var prizeImagePlaceholder2 = paper.rect(
                                590, 189, // x, y
                                213, 140 // width, height
                            ).attr({
                                'fill': 'white',
                                'stroke': 'black',
                                'stroke-width': 1,
                                'stroke-opacity': 0.3
                            });
                            prizeImagePlaceholder2.node.id = 'prize-image-placeholder-2-' + tpl;
                            var prizeImage2 = paper.image(
                                '{{ banner.prize[2].image.attrs[1].src }}',
                                595, 194,
                                203, 130
                            );
                            prizeImage2.node.id = 'prize-image-src-2-' + tpl;
                            // prize description 2
                            var prizeDescriptionPlaceholder2 = paper.rect(
                                595, '{{ banner.prize[2].image.y }}', // x, y
                                203, 30 // width, height
                            ).attr({
                                'fill': 'black',
                                'fill-opacity': 0.75,
                                'stroke': 'none'
                            });
                            prizeDescriptionPlaceholder2.node.id = 'prize-image-description-placeholder-2-' + tpl;
                            var prizeDescriptionHtml2 = paper.foreignObject(
                                '<p ng-bind-html="banner.prize[2].image.attrs[1].text" style="font-family: {{banner.prize[2].text.font.family}}"></p>',
                                595, '{{ banner.prize[2].image.y }}',
                                203, 30,
                                'foreign-object-prize-2 prize-figure'
                            );
                            prizeDescriptionHtml2.node.id = 'prize-image-description-text-2-' + tpl;
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
                            break;
                    }

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
                    var gSetText = paper.set(placeText, textHtml);
                    defaultOptions.configOnClick = onClickHandlerConfigTransform;
                    var ftText = paper.freeTransform(gSetText, defaultOptions, onTransform).hideHandles();
                    angular.extend(gSetText.freeTransform.attrs, scope.banner.text.transform);
                    gSetText.freeTransform.apply();

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
                            var content, model = null;

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
                            ft.hideHandles();
                        });

                        if (selected) {
                            // show transform for selected element
                            elFts[selected].showHandles();
                        } else {
                            // scope.banner.draw = null;
                            slidePush.pushForceCloseById('menu-top');
                            $("body").animate({
                                scrollTop: 0
                            }, "slow");
                            scope.banner.onEdit = false;
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
                        $("body").animate({
                            scrollTop: $('#' + ID).offset().top - 60
                        }, "slow");
                        scope.banner.onEdit = true;
                        slidePush.pushById('menu-top');
                    };

                    var fts = [ftFb, ftLogo, ftText];
                    var elFts = {
                        'fb': ftFb,
                        'logo': ftLogo,
                        'text': ftText,
                    };

                    // compile scope to svg
                    $compile(paper.canvas)(scope);

                }
            };
        });
});