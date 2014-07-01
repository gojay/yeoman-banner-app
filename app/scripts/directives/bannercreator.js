define(['angular'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.directives.Bannercreator', [])
  	.directive('bannerCreator', function ($compile) {
      return {
      	template: '<div data-snap-ignore="true"></div>',
      	restrict: 'E',
        scope: {
          banner : '=ngModel'
        },
        replace: true,
      	link: function postLink(scope, element, attrs, ctrl) {
            element.attr('id', attrs.id).addClass(attrs.class);
            // console.log('bannerCreator:model', scope.banner);
            // console.log('bannerCreator:attrs', attrs);
            // console.log('bannerCreator:element', element[0]);

            scope.$watch('banner.draw', function(value) {
                if (!elFts[scope.banner.selected]) return;
                elFts[scope.banner.selected].setOpts({
                    draw: [value == 'bbox' ? 'bbox' : null, value == 'circle' ? 'circle' : null]
                });
            });

            var paper = Raphael(attrs.id, 810, 380);

            // add definition styles for foreignObject HTML
            var defs  = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            var css   = "svg{background-color:#FFF}body{background-color:transparent}.foreign-object-0 h2{text-align:left;color:#FFF;font-family:Rockwell;font-weight:400;font-size:27px;line-height:32px;margin:0;padding:10px 20px;border-bottom:none}.foreign-object-0 h2~p{text-align:left;color:#FFF;font-family:Arial;font-size:13px;line-height:16px;margin:0;padding:0 20px}";
            var style = document.createElement('style');
            style.type = 'text/css';
            style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css));
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
            fb.node.id = 'fb';
            // grouping background & fb
            var gBg = paper.group();
            gBg.push(background).push(fb);
            gBg.node.id = 'group-background';

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
            placeholder.node.id = 'logo-placeholder';
            // logo image
            var logo = paper.image(
                '{{ banner.logo.image }}',
                scope.banner.logo.attrs.x, scope.banner.logo.attrs.y,
                scope.banner.logo.attrs.w, scope.banner.logo.attrs.h
            ).click(onClickHandler);
            logo.node.id = 'logo-image';

            // grouping logo placeholder & image
            var gLogo = paper.group();
            gLogo.push(placeholder).push(logo);
            gLogo.node.id = 'group-logo';

            /* Text */

            // text placeholder
            var placeText = paper.rect(
                scope.banner.text.attrs.place.x,
                scope.banner.text.attrs.place.y,
                scope.banner.text.attrs.place.w,
                scope.banner.text.attrs.place.h
            ).attr({
                'fill': 'black',
                'fill-opacity': 0.75
            }).click(onClickHandler);
            placeText.node.id = 'text-place';
            // text html
            var textHtml = paper.foreignObject('<h2 ng-bind-html="banner.text.html.title|comaToNewLine"></h2><p ng-bind-html="banner.text.html.description"></p>',
                scope.banner.text.attrs.html.x,
                scope.banner.text.attrs.html.y,
                scope.banner.text.attrs.html.w,
                scope.banner.text.attrs.html.h,
                'foreign-object-0'
            );
            textHtml.node.id = 'text-html';
            textHtml.click(onClickHandler);
            // grouping place & text
            var gText = paper.group();
            gText.push(placeText).push(textHtml);
            gText.node.id = 'group-text';

            /* Transform */

            // Transform fb
            var ftFb = paper.freeTransform(fb, {
                keepRatio: ['axisX', 'axisY', 'bboxCorners', 'bboxSides']
            }, onTransform).hideHandles();
            angular.extend(fb.freeTransform.attrs, scope.banner.fb.transform);
            fb.freeTransform.apply();

            // Transform logo
            var gSetLogo = paper.set(placeholder, logo);
            var ftLogo = paper.freeTransform(gSetLogo, {
                keepRatio: ['axisX', 'axisY', 'bboxCorners', 'bboxSides']
            }, onTransform).hideHandles();
            angular.extend(gSetLogo.freeTransform.attrs, scope.banner.logo.transform);
            gSetLogo.freeTransform.apply();

            // Transform text
            var gSetText = paper.set(placeText, textHtml);
            var ftText = paper.freeTransform(gSetText, {
                keepRatio: ['axisX', 'axisY', 'bboxCorners', 'bboxSides']
            }, onTransform).hideHandles();
            angular.extend(gSetText.freeTransform.attrs, scope.banner.text.transform);
            gSetText.freeTransform.apply();

            /* Callback */

            // raphael element
            function onClickHandler(e) {
                var el = e.target,
                    id = el.id;

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
                    scope.draw = null;
                }

                scope.banner.selected = selected;
                scope.$apply();
            };
            // raphael free transform
            function onTransform(ft, events) {
                if (/end/.test(events.toString())) {
                    var id = ft.items[0].el.node.id;
                    console.info(id);
                    console.log(JSON.stringify(ft.attrs));

                    if (/text/.test(id)) {
                        scope.banner.text.transform = ft.attrs;
                    } else if (/logo/.test(id)) {
                        scope.banner.logo.transform = ft.attrs;
                    } else if (/fb/.test(id)) {
                        scope.banner.fb.transform = ft.attrs;
                    }
                    scope.$apply();
                }
            }

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
