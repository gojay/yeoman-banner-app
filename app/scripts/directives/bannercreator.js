define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.directives.Bannercreator', [])
        .directive('bannerCreator', function($compile) {
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

                        var ID  = attrs.id,
                            tpl = attrs.tpl || 0,
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
                            var placeholder = null;
                            var x = (params.distance) ? params.model.attrs.x + params.distance.x : params.model.attrs.x ;
                            // placeholder
                            if( params.placeholder ){
                                var attrs = (params.attrs) ? params.attrs : { fill: 'white' };
                                placeholder = paper.rect(
                                    x - 5,
                                    params.model.attrs.y - 5,
                                    params.model.attrs.w + 10,
                                    params.model.attrs.h + 10
                                ).attr(attrs).shadow(0, 1, 4, 0.6);
                                if( params.onClick ){
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
                            if( params.onClick ){
                                image.click(params.onClick);
                            }

                            return {
                                placeholder: placeholder,
                                image: image
                            };
                        };
                        this.createText = function( params ) {
                            // placeholder
                            var placeholder = null;
                            var x = (params.distance) ? params.model.attrs.x + params.distance.x : params.model.attrs.x ;
                            if( params.placeholder ){
                                placeholder = paper.rect(
                                    x,
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
                                x,
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

                    var paper = ctrl.paper,
                        tpl   = ctrl.tpl,
                        className = ctrl.className;

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
                        value  : '{{ banner.background.image }}',
                        model  : scope.banner.background,
                        onClick: onClickHandler
                    });

                    /* FB element */

                    var fb = ctrl.createImage({
                        placeholder : false,
                        id          : 'fb',
                        value       : '{{ banner.fb.image }}',
                        model       : scope.banner.fb,
                        onClick     : onClickHandler
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
                        value  : '{{ banner.logo.image }}',
                        model  : scope.banner.logo,
                        onClick: onClickHandler
                    });
                    // transform element
                    var gSetLogo = paper.set(logo.image);
                    var ftLogo = paper.freeTransform(gSetLogo, defaultOptions, onTransform).hideHandles();
                    angular.extend(gSetLogo.freeTransform.attrs, scope.banner.logo.transform);
                    gSetLogo.freeTransform.apply();

                    // grouping elements: background, fb & logo

                    var gImage = paper.group();
                    gImage.push(background.image).push(fb.image).push(logo.placeholder).push(logo.image);
                    gImage.node.id = 'group-image-' + tpl;

                    /* Content element */

                    var content = ctrl.createText({
                        placeholder: true,
                        model: scope.banner.text,
                        title: 'text',
                        onClick: onClickHandler
                    });
                    // grouping place & text
                    var gText = paper.group();
                    gText.push(content.placeholder).push(content.text);
                    gText.node.id = 'group-text-' + tpl;
                    // transform text
                    var gSetText = paper.set(content.placeholder, content.text);
                    var ftText = paper.freeTransform(gSetText, options, onTransform).hideHandles();
                    angular.extend(gSetText.freeTransform.attrs, scope.banner.text.transform);
                    gSetText.freeTransform.apply();

                    /* Prizes element */

                    var ftPrizeHeader, ftPrizeImage = null;
                    switch (tpl) {
                        case '1':
                            // header
                            var prize = ctrl.createText({
                                placeholder : true,
                                model       : scope.banner.prize[1].header,
                                title       : 'prize[1].header',
                                className   : 'foreign-object-prize-1',
                                onClick     : onClickHandler
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
                            angular.forEach([0], function(value, index){
                                // image
                                var prizeImage = ctrl.createImage({
                                    placeholder: true,
                                    value  : '{{ banner.prize[1].image.data['+ index +'].src }}',
                                    model  : scope.banner.prize[1].image,
                                    id     : 'prize',
                                    distance : { x: value },
                                    onClick: onClickHandler
                                });
                                // prize description
                                var prizeImageDescription = ctrl.createText({
                                    placeholder: true,
                                    model  : scope.banner.prize[1].image,
                                    title  : 'prize[1].image',
                                    className: 'foreign-object-prize-1 prize-figure',
                                    value  : 'banner.prize[1].image.data['+ index +'].text',
                                    height : 50,
                                    distance : { x: value },
                                    onClick: onClickHandler
                                });
                                var prizeImageDescriptionPlaceholder = prizeImageDescription.placeholder;
                                var prizeDescriptionHtml = prizeImageDescription.text;                         
                                // grouping
                                var gPrizeImage = paper.group();
                                gPrizeImage.node.id = 'group-prize-image-' + (index + 1) + '-' + tpl;
                                gPrizeImage
                                    .push(prizeImage.placeholder)
                                    .push(prizeImage.image)
                                    .push(prizeImageDescription.placeholder)
                                    .push(prizeImageDescription.text);
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
                                placeholder : true,
                                model       : scope.banner.prize[2].header,
                                title       : 'prize[2].header',
                                className   : 'foreign-object-prize-2',
                                onClick     : onClickHandler
                            });
                            // set transform elements
                            options.configSize = 'small';
                            var gSetPrizeHeader = paper.set(prize.placeholder, prize.text);
                            ftPrizeHeader = paper.freeTransform(gSetPrizeHeader, options, onTransform).hideHandles();
                            angular.extend(gSetPrizeHeader.freeTransform.attrs, scope.banner.prize[2].header.transform);
                            gSetPrizeHeader.freeTransform.apply();

                            var gSetPrizeImage = paper.set();
                            angular.forEach([0, 216], function(value, index){
                                // image
                                var prizeImage = ctrl.createImage({
                                    placeholder : true,
                                    value       : '{{ banner.prize[2].image.data['+ index +'].src }}',
                                    model       : scope.banner.prize[2].image,
                                    id          : 'prize',
                                    distance    : { x: value },
                                    onClick     : onClickHandler
                                });
                                // prize description
                                var prizeDescription = ctrl.createText({
                                    placeholder : true,
                                    model       : scope.banner.prize[2].image,
                                    title       : 'prize[2].image',
                                    className   : 'foreign-object-prize-2 prize-figure',
                                    value       : 'banner.prize[2].image.data['+ index +'].text',
                                    height      : 30,
                                    distance    : { x: value },
                                    onClick     : onClickHandler
                                }); 
                                // grouping
                                var gPrizeImage = paper.group();
                                gPrizeImage.node.id = 'group-prize-image-' + (index + 1) + '-' + tpl;
                                gPrizeImage.push(prizeImage.placeholder)
                                           .push(prizeImage.image)
                                           .push(prizeDescription.placeholder)
                                           .push(prizeDescription.text);
                                // set transform elements
                                gSetPrizeImage.push(prizeImage.placeholder)
                                              .push(prizeImage.image)
                                              .push(prizeDescription.placeholder)
                                              .push(prizeDescription.text);
                            });
                            // set transform elements
                            options.configSize = 'medium';
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